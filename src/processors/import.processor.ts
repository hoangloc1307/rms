import { Job } from 'bullmq';
import { eq, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';
import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';
import { db } from '~/database';
import { importJobRows, importJobs, items } from '~/database/schemas';
import { AppError } from '~/errors';
import { getDiffData } from '~/utils';
import { ItemMasterImportInput, itemMasterImportSchema } from '~/validations';
import { JobDataMap } from '~/workers/worker';

const importItemMaster = async (jobRecord: typeof importJobs.$inferSelect) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(jobRecord.fileUrl);

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw AppError.badRequest('Worksheet not found');
  }

  const rawData: Record<string, unknown>[] = [];
  const validatedData: (ItemMasterImportInput & { rowNumber: number })[] = [];
  const errorData: (typeof importJobRows.$inferInsert)[] = [];
  const createdData: (typeof importJobRows.$inferInsert)[] = [];
  const updatedData: (typeof importJobRows.$inferInsert)[] = [];
  const skippedData: (typeof importJobRows.$inferInsert)[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const rowData = {
      itemCode: row.getCell(1).value ?? '',
      productCode: row.getCell(2).value ?? '',
      name: row.getCell(3).value ?? '',
      unit: row.getCell(4).value ?? '',
      baseUnit: row.getCell(5).value ?? '',
      conversionFactor: row.getCell(6).value ?? '',
      deliveryOnBaseUnit: row.getCell(7).value ?? '',
      trackingType: row.getCell(8).value ?? '',
      note: row.getCell(9).value ?? '',
    };

    rawData.push(rowData);

    const parsedData = itemMasterImportSchema.safeParse(rowData);

    if (!parsedData.success) {
      errorData.push({
        jobId: jobRecord.id,
        rowNumber,
        rowKey: (rowData.itemCode as string) ?? `row-${rowNumber}`,
        action: 'ERROR',
        rawData: rowData,
        errorData: parsedData.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    } else {
      validatedData.push({ ...parsedData.data, rowNumber });
    }
  });

  const itemCodes = validatedData.map((item) => item.itemCode);

  const existingItems = await db.query.items.findMany({
    where: inArray(items.itemCode, itemCodes),
  });

  const exiexistingItemByItemCode = existingItems.reduce(
    (acc, item) => {
      acc[item.itemCode] = item;
      return acc;
    },
    {} as Record<string, typeof items.$inferSelect>,
  );

  validatedData.forEach((item) => {
    const existingItem = exiexistingItemByItemCode[item.itemCode];
    const itemWithoutRowNumber = _omit(item, 'rowNumber');

    if (!existingItem) {
      createdData.push({
        jobId: jobRecord.id,
        rowNumber: item.rowNumber,
        rowKey: item.itemCode,
        action: 'CREATE',
        rawData: rawData[item.rowNumber - 2],
        normalizedData: itemWithoutRowNumber,
      });
    } else {
      const formattedItem = {
        ...existingItem,
        conversionFactor: Number(existingItem.conversionFactor),
      };

      const isSame = _isEqual(
        {
          productCode: item.productCode,
          name: item.name,
          unit: item.unit,
          baseUnit: item.baseUnit,
          conversionFactor: item.conversionFactor,
          deliveryOnBaseUnit: item.deliveryOnBaseUnit,
          note: item.note,
        },
        {
          productCode: formattedItem.productCode,
          name: formattedItem.name,
          unit: formattedItem.unit,
          baseUnit: formattedItem.baseUnit,
          conversionFactor: formattedItem.conversionFactor,
          deliveryOnBaseUnit: formattedItem.deliveryOnBaseUnit,
          note: formattedItem.note,
        },
      );

      if (isSame) {
        skippedData.push({
          jobId: jobRecord.id,
          rowNumber: item.rowNumber,
          rowKey: item.itemCode,
          action: 'SKIP',
          rawData: rawData[item.rowNumber - 2],
          normalizedData: itemWithoutRowNumber,
        });
      } else {
        updatedData.push({
          jobId: jobRecord.id,
          rowNumber: item.rowNumber,
          rowKey: item.itemCode,
          action: 'UPDATE',
          rawData: rawData[item.rowNumber - 2],
          normalizedData: itemWithoutRowNumber,
          diffData: getDiffData(formattedItem, item, [
            'productCode',
            'name',
            'unit',
            'baseUnit',
            'conversionFactor',
            'deliveryOnBaseUnit',
            'note',
          ]),
        });
      }
    }
  });

  await db.transaction(async (tx) => {
    const insertImportJobRows = tx
      .insert(importJobRows)
      .values([...errorData, ...createdData, ...updatedData, ...skippedData]);

    const updateImportJob = tx
      .update(importJobs)
      .set({
        status: 'VALIDATED',
        totalRows: rawData.length,
        createdRows: createdData.length,
        updatedRows: updatedData.length,
        skippedRows: skippedData.length,
        errorRows: errorData.length,
      })
      .where(eq(importJobs.token, jobRecord.token));

    await Promise.all([insertImportJobRows, updateImportJob]);
  });
};

export const importProcessor = async (job: Job<JobDataMap['import']>) => {
  const jobRecord = await db.query.importJobs.findFirst({
    where: eq(importJobs.token, job.data.token),
  });

  if (!jobRecord) {
    throw AppError.notFound('Job not found');
  }

  if (jobRecord.status === 'COMMITTED' || jobRecord.status === 'EXPIRED') {
    throw AppError.conflict(`Job cannot be processed from ${jobRecord.status} state`);
  }

  try {
    await db
      .update(importJobs)
      .set({
        status: 'VALIDATING',
        totalRows: 0,
        createdRows: 0,
        updatedRows: 0,
        skippedRows: 0,
        errorRows: 0,
        committedAt: null,
      })
      .where(eq(importJobs.token, job.data.token));

    switch (job.data.type) {
      case 'item-master':
        await importItemMaster(jobRecord);
        break;
      default:
        throw AppError.badRequest(`Unsupported import type: ${job.data.type}`);
    }

    return {
      token: job.data.token,
      userId: jobRecord.createdBy,
      type: 'import',
    };
  } catch (error) {
    await db
      .update(importJobs)
      .set({
        status: 'FAILED',
        committedAt: null,
      })
      .where(eq(importJobs.token, job.data.token));

    throw error;
  }
};
