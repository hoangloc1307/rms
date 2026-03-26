import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { warehouses, zones } from '~/database/schemas';
import { AppError } from '~/errors';
import { ListZoneSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: ListZoneSchemaQuery) => {
  const { page, limit, search, warehouseCode } = query;

  const whereCondition = and(
    eq(zones.isActive, true),
    warehouseCode ? eq(zones.warehouseCode, warehouseCode) : undefined,
    search ? or(like(zones.code, `%${search}%`), like(zones.name, `%${search}%`)) : undefined,
  );

  const dataPromise = db.query.zones.findMany({
    where: whereCondition,
    with: {
      warehouse: true,
    },
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(zones).where(whereCondition);

  const [data, totalData] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData[0].total };
};

// ==================== GET DETAIL ====================

const getDetail = async (code: string) => {
  const data = await db.query.zones.findFirst({
    where: and(eq(zones.code, code), eq(zones.isActive, true)),
    with: {
      warehouse: true,
    },
  });

  if (!data) {
    throw AppError.notFound('Zone not found');
  }

  return { data };
};

// ==================== CREATE ====================

type CreateZoneParams = {
  data: {
    code: string;
    warehouseCode: string;
    name: string;
    note?: string;
  };
  createdBy: string;
};

const create = async (params: CreateZoneParams) => {
  const { data, createdBy } = params;

  const [existingZone, parentWarehouse] = await Promise.all([
    db.query.zones.findFirst({
      where: eq(zones.code, data.code),
    }),
    db.query.warehouses.findFirst({
      where: and(eq(warehouses.code, data.warehouseCode), eq(warehouses.isActive, true)),
    }),
  ]);

  if (existingZone) {
    throw AppError.conflict('Zone already exists');
  }

  if (!parentWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  const insertedData = await db
    .insert(zones)
    .values({
      ...data,
      createdBy,
    })
    .returning();

  return insertedData[0].code;
};

// ==================== UPDATE ====================

type UpdateZoneParams = {
  code: string;
  data: {
    warehouseCode?: string;
    name?: string;
    note?: string;
    isActive?: boolean;
  };
  updatedBy: string;
};

const update = async (params: UpdateZoneParams) => {
  const { code, data, updatedBy } = params;

  const existingZone = await db.query.zones.findFirst({
    where: and(eq(zones.code, code), eq(zones.isActive, true)),
  });

  if (!existingZone) {
    throw AppError.notFound('Zone not found');
  }

  if (data.warehouseCode) {
    const parentWarehouse = await db.query.warehouses.findFirst({
      where: and(eq(warehouses.code, data.warehouseCode), eq(warehouses.isActive, true)),
    });

    if (!parentWarehouse) {
      throw AppError.notFound('Warehouse not found');
    }
  }

  const updatedData = await db
    .update(zones)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(zones.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== DELETE ====================

type DeleteZoneParams = {
  code: string;
  updatedBy: string;
};

const remove = async (params: DeleteZoneParams) => {
  const { code, updatedBy } = params;

  const existingZone = await db.query.zones.findFirst({
    where: and(eq(zones.code, code), eq(zones.isActive, true)),
  });

  if (!existingZone) {
    throw AppError.notFound('Zone not found');
  }

  const updatedData = await db
    .update(zones)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(zones.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== EXPORT ====================

export const zoneService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
