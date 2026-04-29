import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { warehouses, zones } from '~/database/schemas';
import { AppError } from '~/errors';
import { PaginationSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: PaginationSchemaQuery) => {
  const { page, limit, search } = query;

  const whereCondition = and(
    eq(warehouses.isActive, true),
    search ? or(like(warehouses.code, `%${search}%`), like(warehouses.name, `%${search}%`)) : undefined,
  );

  const dataPromise = db.query.warehouses.findMany({
    where: whereCondition,
    limit,
    offset: page && limit ? (page - 1) * limit : undefined,
  });

  const totalPromise = db.select({ total: count() }).from(warehouses).where(whereCondition);

  const [data, [{ total }]] = await Promise.all([dataPromise, totalPromise]);

  return { data, total };
};

// ==================== GET DETAIL ====================

const getDetail = async (code: string) => {
  const data = await db.query.warehouses.findFirst({
    where: and(eq(warehouses.code, code), eq(warehouses.isActive, true)),
  });

  if (!data) {
    throw AppError.notFound('Warehouse not found');
  }

  return { data };
};

// ==================== CREATE ====================

type CreateWarehouseParams = {
  data: {
    code: string;
    name: string;
    note?: string;
  };
  userId: string;
};

const create = async (params: CreateWarehouseParams) => {
  const { data, userId } = params;
  const now = new Date();

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: eq(warehouses.code, data.code),
  });

  if (!existingWarehouse) {
    const [insertedData] = await db
      .insert(warehouses)
      .values({
        ...data,
        createdBy: userId,
      })
      .returning();

    return insertedData.code;
  }

  if (existingWarehouse.isActive) {
    throw AppError.conflict('Warehouse already exists');
  }

  const [updatedData] = await db
    .update(warehouses)
    .set({
      ...data,
      isActive: true,
      updatedAt: now,
      updatedBy: userId,
    })
    .where(eq(warehouses.code, existingWarehouse.code))
    .returning();

  return updatedData.code;
};

// ==================== UPDATE ====================

type UpdateWarehouseParams = {
  code: string;
  data: {
    name?: string;
    note?: string;
  };
  userId: string;
};

const update = async (params: UpdateWarehouseParams) => {
  const { code, data, userId } = params;

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: and(eq(warehouses.code, code), eq(warehouses.isActive, true)),
  });

  if (!existingWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  const [updatedData] = await db
    .update(warehouses)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(warehouses.code, code))
    .returning();

  return updatedData.code;
};

// ==================== DELETE ====================

type DeleteWarehouseParams = {
  code: string;
  userId: string;
};

const remove = async (params: DeleteWarehouseParams) => {
  const { code, userId } = params;

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: and(eq(warehouses.code, code), eq(warehouses.isActive, true)),
  });

  if (!existingWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  const existingZone = await db.query.zones.findFirst({
    where: and(eq(zones.warehouseCode, code), eq(zones.isActive, true)),
  });

  if (existingZone) {
    throw AppError.conflict('Warehouse has active zones');
  }

  const [updatedData] = await db
    .update(warehouses)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(warehouses.code, code))
    .returning();

  return updatedData.code;
};

// ==================== EXPORT ====================

export const warehouseService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
