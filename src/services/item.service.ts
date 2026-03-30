import { addMinutes, format } from 'date-fns';
import { and, count, eq, inArray, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { importJobRows, importJobs, items, ItemTrackingType } from '~/database/schemas';
import { AppError } from '~/errors';
import { addImportJob } from '~/helpers';
import { PaginationSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: PaginationSchemaQuery) => {
  const { page, limit, search } = query;

  const whereCondition = search
    ? and(
        eq(items.isActive, true),
        or(
          like(items.name, `%${search}%`),
          like(items.productCode, `%${search}%`),
          like(items.unit, `%${search}%`),
          like(items.baseUnit, `%${search}%`),
        ),
      )
    : eq(items.isActive, true);

  const dataPromise = db.query.items.findMany({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(items).where(whereCondition);

  const [data, totalData] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData[0].total };
};

// ==================== GET DETAIL ====================

const getItemMasterDetail = async (itemCode: string) => {
  const data = await db.query.items.findFirst({
    where: and(eq(items.itemCode, itemCode), eq(items.isActive, true)),
  });

  if (!data) {
    throw AppError.notFound('Item not found');
  }

  return { data };
};

// ==================== CREATE ITEM MASTER ====================

type CreateItemMasterParams = {
  data: {
    itemCode: string;
    productCode: string;
    name: string;
    unit: string;
    baseUnit: string;
    conversionFactor?: number;
    deliveryOnBaseUnit?: boolean;
    note?: string;
    trackingType: ItemTrackingType;
  };
  createdBy: string;
};

const createItemMaster = async (params: CreateItemMasterParams) => {
  const { data, createdBy } = params;

  const existingItem = await db.query.items.findFirst({
    where: eq(items.itemCode, data.itemCode),
  });

  if (existingItem) {
    throw AppError.conflict('Item already exists');
  }

  const insertedData = await db
    .insert(items)
    .values({
      ...data,
      conversionFactor: data.conversionFactor?.toString(),
      createdBy,
    })
    .returning();

  return insertedData[0].itemCode;
};

// ==================== DELETE ITEM MASTER ====================

type DeleteItemMasterParams = {
  itemCode: string;
  updatedBy: string;
};

const deleteItemMaster = async (params: DeleteItemMasterParams) => {
  const { itemCode, updatedBy } = params;

  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.itemCode, itemCode), eq(items.isActive, true)),
  });

  if (!existingItem) {
    throw AppError.notFound('Item not found');
  }

  const updatedData = await db
    .update(items)
    .set({ isActive: false, updatedAt: new Date(), updatedBy })
    .where(eq(items.itemCode, itemCode))
    .returning();

  return updatedData[0].itemCode;
};

// ==================== UPDATE ITEM MASTER ====================

type UpdateItemMasterParams = {
  itemCode: string;
  data: {
    productCode?: string;
    name?: string;
    unit?: string;
    baseUnit?: string;
    conversionFactor?: number;
    deliveryOnBaseUnit?: boolean;
    note?: string;
  };
  updatedBy: string;
};

const updateItemMaster = async (params: UpdateItemMasterParams) => {
  const { itemCode, data, updatedBy } = params;

  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.itemCode, itemCode), eq(items.isActive, true)),
  });

  if (!existingItem) {
    throw AppError.notFound('Item not found');
  }

  const updatedData = await db
    .update(items)
    .set({
      ...data,
      conversionFactor: data.conversionFactor?.toString(),
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(items.itemCode, itemCode))
    .returning();

  return updatedData[0].itemCode;
};

// ==================== IMPORT ITEM MASTER ====================

type ImportItemMasterParams = {
  file: Express.Multer.File;
  createdBy: string;
};

const importItemMaster = async (params: ImportItemMasterParams) => {
  const { file, createdBy } = params;
  const time = new Date();

  const token = `import-${format(time, 'yyyyMMddHHmmss')}`;
  const expiredAt = addMinutes(time, 10);

  const insertedData = await db
    .insert(importJobs)
    .values({
      token,
      type: 'item-master',
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

// ==================== COMMIT IMPORT ITEM MASTER ====================

type CommitItemMasterImportParams = {
  token: string;
  committedBy: string;
};

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

const commitItemMasterImport = async (params: CommitItemMasterImportParams) => {
  const { token, committedBy } = params;
  const time = new Date();

  const importJob = await db.query.importJobs.findFirst({
    where: eq(importJobs.token, token),
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

  if (importJob.errorRows > 0) {
    throw AppError.conflict('Import contains invalid rows, please fix file and re-import');
  }

  await db.transaction(async (tx) => {
    const rows = await tx.query.importJobRows.findMany({
      where: and(eq(importJobRows.jobId, importJob.id), inArray(importJobRows.action, ['CREATE', 'UPDATE'])),
    });

    const createdRows = rows.filter((row) => row.action === 'CREATE');
    const updatedRows = rows.filter((row) => row.action === 'UPDATE');

    if (createdRows.length > 0) {
      await tx.insert(items).values(
        createdRows.map((row) => {
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
    }

    if (updatedRows.length > 0) {
      await Promise.all(
        updatedRows.map(async (row) => {
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
    }

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

// ==================== EXPORT ====================

export const itemMasterService = {
  getAll,
  getItemMasterDetail,
  createItemMaster,
  deleteItemMaster,
  updateItemMaster,
  importItemMaster,
  commitItemMasterImport,
};
