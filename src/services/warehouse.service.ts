import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { warehouses } from '~/database/schemas';
import { AppError } from '~/errors';
import { ListWarehouseSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: ListWarehouseSchemaQuery) => {
  const { page, limit, search } = query;

  const whereCondition = search
    ? and(eq(warehouses.isActive, true), or(like(warehouses.code, `%${search}%`), like(warehouses.name, `%${search}%`)))
    : eq(warehouses.isActive, true);

  const dataPromise = db.query.warehouses.findMany({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(warehouses).where(whereCondition);

  const [data, totalData] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData[0].total };
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
  createdBy: string;
};

const create = async (params: CreateWarehouseParams) => {
  const { data, createdBy } = params;

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: eq(warehouses.code, data.code),
  });

  if (existingWarehouse) {
    throw AppError.conflict('Warehouse already exists');
  }

  const insertedData = await db
    .insert(warehouses)
    .values({
      ...data,
      createdBy,
    })
    .returning();

  return insertedData[0].code;
};

// ==================== UPDATE ====================

type UpdateWarehouseParams = {
  code: string;
  data: {
    name?: string;
    note?: string;
  };
  updatedBy: string;
};

const update = async (params: UpdateWarehouseParams) => {
  const { code, data, updatedBy } = params;

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: and(eq(warehouses.code, code), eq(warehouses.isActive, true)),
  });

  if (!existingWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  const updatedData = await db
    .update(warehouses)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(warehouses.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== DELETE ====================

type DeleteWarehouseParams = {
  code: string;
  updatedBy: string;
};

const remove = async (params: DeleteWarehouseParams) => {
  const { code, updatedBy } = params;

  const existingWarehouse = await db.query.warehouses.findFirst({
    where: and(eq(warehouses.code, code), eq(warehouses.isActive, true)),
  });

  if (!existingWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  const updatedData = await db
    .update(warehouses)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(warehouses.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== EXPORT ====================

export const warehouseService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
