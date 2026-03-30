import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { racks, warehouses, zones } from '~/database/schemas';
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
      warehouse: {
        columns: {
          code: true,
          name: true,
        },
      },
    },
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(zones).where(whereCondition);

  const [data, [{ total }]] = await Promise.all([dataPromise, totalPromise]);

  return { data, total };
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
  userId: string;
};

const create = async (params: CreateZoneParams) => {
  const { data, userId } = params;
  const now = new Date();

  const [existingZone, parentWarehouse] = await Promise.all([
    db.query.zones.findFirst({
      where: eq(zones.code, data.code),
    }),
    db.query.warehouses.findFirst({
      where: and(eq(warehouses.code, data.warehouseCode), eq(warehouses.isActive, true)),
    }),
  ]);

  if (!parentWarehouse) {
    throw AppError.notFound('Warehouse not found');
  }

  if (!existingZone) {
    const [insertedData] = await db
      .insert(zones)
      .values({
        ...data,
        createdBy: userId,
      })
      .returning();

    return insertedData.code;
  }

  if (existingZone.isActive) {
    throw AppError.conflict('Zone already exists');
  }

  const [updatedData] = await db
    .update(zones)
    .set({
      ...data,
      isActive: true,
      updatedAt: now,
      updatedBy: userId,
    })
    .where(eq(zones.code, existingZone.code))
    .returning();

  return updatedData.code;
};

// ==================== UPDATE ====================

type UpdateZoneParams = {
  code: string;
  data: {
    warehouseCode?: string;
    name?: string;
    note?: string;
  };
  userId: string;
};

const update = async (params: UpdateZoneParams) => {
  const { code, data, userId } = params;

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

  const [updatedData] = await db
    .update(zones)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(zones.code, code))
    .returning();

  return updatedData.code;
};

// ==================== DELETE ====================

type DeleteZoneParams = {
  code: string;
  userId: string;
};

const remove = async (params: DeleteZoneParams) => {
  const { code, userId } = params;

  const existingZone = await db.query.zones.findFirst({
    where: and(eq(zones.code, code), eq(zones.isActive, true)),
  });

  if (!existingZone) {
    throw AppError.notFound('Zone not found');
  }

  const existingRack = await db.query.racks.findFirst({
    where: and(eq(racks.zoneCode, code), eq(racks.isActive, true)),
  });

  if (existingRack) {
    throw AppError.conflict('Zone has active racks');
  }

  const [updatedData] = await db
    .update(zones)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(zones.code, code))
    .returning();

  return updatedData.code;
};

// ==================== EXPORT ====================

export const zoneService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
