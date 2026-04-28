import { addMinutes, format } from 'date-fns';
import { and, asc, eq, gte, inArray } from 'drizzle-orm';
import { db } from '~/database';
import { importJobRows, importJobs, items, ItemTrackingType } from '~/database/schemas';
import { AppError } from '~/errors';
import { addImportJob } from '~/helpers';
import { PgTx } from '~/types/drizzle';

// ==================== UPLOAD IMPORT ====================

type ImportUploadParams = {
  file: Express.Multer.File;
  type: string;
  createdBy: string;
};

const importUpload = async (params: ImportUploadParams) => {
  const { file, type, createdBy } = params;
  const time = new Date();

  const token = `import-${format(time, 'yyyyMMddHHmmss')}`;
  const expiredAt = addMinutes(time, 10);

  const insertedData = await db
    .insert(importJobs)
    .values({
      token,
      type,
      status: 'PENDING',
      createdBy,
      totalRows: 0,
      createdRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      errorRows: 0,
      expiredAt,
      fileName: file.originalname,
      fileUrl: file.path,
    })
    .returning();

  await addImportJob({ token: insertedData[0].token, type: insertedData[0].type });

  return {
    token: insertedData[0].token,
    status: insertedData[0].status,
    expiredAt: insertedData[0].expiredAt,
  };
};

// ==================== GET IMPORT BY CODE ====================

const getImportByCode = async (token: string) => {
  const result = await db.query.importJobs.findFirst({
    where: and(eq(importJobs.token, token), gte(importJobs.expiredAt, new Date()), eq(importJobs.status, 'VALIDATED')),
    with: {
      importJobRows: {
        columns: {
          jobId: false,
          rawData: false,
          rowKey: false,
        },
        orderBy: asc(importJobRows.rowNumber),
      },
    },
    columns: {
      fileUrl: false,
    },
  });

  if (!result) {
    throw AppError.notFound('Import not found or expired');
  }

  return result;
};

// ==================== IMPORT ITEM MASTER ====================

type ItemImportNormalizedData = {
  itemCode: string;
  productCode: string;
  name: string;
  unit: string;
  baseUnit: string;
  conversionFactor: number;
  deliveryOnBaseUnit: boolean;
  note: string | null;
  trackingType: ItemTrackingType;
};

const createItemMasterRows = async (rows: (typeof importJobRows.$inferSelect)[], committedBy: string, tx: PgTx) => {
  return await tx.insert(items).values(
    rows.map((row) => {
      const normalizedData = row.normalizedData as ItemImportNormalizedData;

      return {
        itemCode: normalizedData.itemCode,
        productCode: normalizedData.productCode,
        name: normalizedData.name,
        unit: normalizedData.unit,
        baseUnit: normalizedData.baseUnit,
        conversionFactor: normalizedData.conversionFactor.toString(),
        deliveryOnBaseUnit: normalizedData.deliveryOnBaseUnit,
        note: normalizedData.note ?? null,
        createdBy: committedBy,
        trackingType: normalizedData.trackingType,
      };
    }),
  );
};

const updateItemMasterRows = async (
  rows: (typeof importJobRows.$inferSelect)[],
  committedBy: string,
  time: Date,
  tx: PgTx,
) => {
  await Promise.all(
    rows.map(async (row) => {
      const normalizedData = row.normalizedData as ItemImportNormalizedData;

      const result = await tx
        .update(items)
        .set({
          productCode: normalizedData.productCode,
          name: normalizedData.name,
          unit: normalizedData.unit,
          baseUnit: normalizedData.baseUnit,
          conversionFactor: normalizedData.conversionFactor.toString(),
          deliveryOnBaseUnit: normalizedData.deliveryOnBaseUnit,
          note: normalizedData.note ?? null,
          updatedAt: time,
          updatedBy: committedBy,
        })
        .where(eq(items.itemCode, normalizedData.itemCode))
        .returning({ itemCode: items.itemCode });

      if (!result.length) {
        throw AppError.conflict(`Item ${normalizedData.itemCode} no longer exists for update`);
      }
    }),
  );
};

// ==================== COMMIT IMPORT ====================

type CommitImportParams = {
  token: string;
  committedBy: string;
  type: string;
};

const commitImport = async (params: CommitImportParams) => {
  const { token, committedBy, type } = params;
  const time = new Date();

  const importJob = await db.query.importJobs.findFirst({
    where: and(eq(importJobs.token, token), eq(importJobs.type, type)),
  });

  if (!importJob) {
    throw AppError.notFound('Import job not found');
  }

  if (importJob.status === 'COMMITTED') {
    throw AppError.conflict('Import job already committed');
  }

  if (importJob.status === 'EXPIRED' || importJob.expiredAt <= new Date()) {
    throw AppError.conflict('Import job has expired');
  }

  if (importJob.status !== 'VALIDATED') {
    throw AppError.conflict(`Import job cannot be committed from ${importJob.status} state`);
  }

  await db.transaction(async (tx) => {
    const rows = await tx.query.importJobRows.findMany({
      where: and(eq(importJobRows.jobId, importJob.id), inArray(importJobRows.action, ['CREATE', 'UPDATE'])),
    });

    const createdRows = rows.filter((row) => row.action === 'CREATE');
    const updatedRows = rows.filter((row) => row.action === 'UPDATE');

    if (createdRows.length > 0) {
      switch (type) {
        case 'item-master':
          await createItemMasterRows(createdRows, committedBy, tx);
          break;
        default:
          throw AppError.badRequest('Invalid import type');
      }
    }

    if (updatedRows.length > 0) {
      switch (type) {
        case 'item-master':
          await updateItemMasterRows(updatedRows, committedBy, time, tx);
          break;
        default:
          throw AppError.badRequest('Invalid import type');
      }
    }

    await tx.delete(importJobRows).where(eq(importJobRows.jobId, importJob.id));

    await tx
      .update(importJobs)
      .set({
        status: 'COMMITTED',
        committedAt: time,
      })
      .where(eq(importJobs.id, importJob.id));
  });

  return true;
};

// ==================== CANCEL IMPORT ====================

type CancelImportParams = {
  token: string;
  canceledBy: string;
  type: string;
};

const cancelImport = async (params: CancelImportParams) => {
  const { token, type } = params;
  const time = new Date();

  const importJob = await db.query.importJobs.findFirst({
    where: and(eq(importJobs.token, token), eq(importJobs.type, type)),
  });

  if (!importJob) {
    throw AppError.notFound('Import job not found');
  }

  if (importJob.status === 'COMMITTED') {
    throw AppError.conflict('Import job already committed');
  }

  if (importJob.status === 'CANCELLED' || importJob.status === 'EXPIRED' || importJob.expiredAt <= new Date()) {
    throw AppError.conflict('Import job already cancelled or expired');
  }

  await db.transaction(async (tx) => {
    await tx.delete(importJobRows).where(eq(importJobRows.jobId, importJob.id));

    await tx
      .update(importJobs)
      .set({
        status: 'CANCELLED',
        cancelledAt: time,
      })
      .where(eq(importJobs.id, importJob.id));
  });

  return true;
};

// ==================== EXPORT ====================

export const importService = {
  importUpload,
  getImportByCode,
  commitImport,
  cancelImport,
};
