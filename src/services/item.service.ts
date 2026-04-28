import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { items, ItemTrackingType } from '~/database/schemas';
import { AppError } from '~/errors';
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
    offset: page && limit ? (page - 1) * limit : undefined,
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

// ==================== EXPORT ====================

export const itemMasterService = {
  getAll,
  getItemMasterDetail,
  createItemMaster,
  deleteItemMaster,
  updateItemMaster,
};
