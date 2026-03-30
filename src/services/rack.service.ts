import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { racks, shelves, zones } from '~/database/schemas';
import { AppError } from '~/errors';
import { ListRackSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: ListRackSchemaQuery) => {
  const { page, limit, search, zoneCode } = query;

  const whereCondition = and(
    eq(racks.isActive, true),
    zoneCode ? eq(racks.zoneCode, zoneCode) : undefined,
    search ? or(like(racks.code, `%${search}%`), like(racks.name, `%${search}%`)) : undefined,
  );

  const dataPromise = db.query.racks.findMany({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(racks).where(whereCondition);

  const [data, [{ total }]] = await Promise.all([dataPromise, totalPromise]);

  return { data, total };
};

// ==================== GET DETAIL ====================

const getDetail = async (code: string) => {
  const data = await db.query.racks.findFirst({
    where: and(eq(racks.code, code), eq(racks.isActive, true)),
    with: {
      zone: {
        columns: {
          code: true,
          name: true,
        },
      },
    },
  });

  if (!data) {
    throw AppError.notFound('Rack not found');
  }

  return { data };
};

// ==================== CREATE ====================

type CreateRackParams = {
  data: {
    code: string;
    zoneCode: string;
    name: string;
    note?: string;
  };
  userId: string;
};

const create = async (params: CreateRackParams) => {
  const { data, userId } = params;
  const now = new Date();

  const [existingRack, parentZone] = await Promise.all([
    db.query.racks.findFirst({
      where: eq(racks.code, data.code),
    }),
    db.query.zones.findFirst({
      where: and(eq(zones.code, data.zoneCode), eq(zones.isActive, true)),
    }),
  ]);

  if (!parentZone) {
    throw AppError.notFound('Zone not found');
  }

  if (!existingRack) {
    const [insertedData] = await db
      .insert(racks)
      .values({
        ...data,
        createdBy: userId,
      })
      .returning();

    return insertedData.code;
  }

  if (existingRack.isActive) {
    throw AppError.conflict('Rack already exists');
  }

  const [updatedData] = await db
    .update(racks)
    .set({
      ...data,
      isActive: true,
      updatedAt: now,
      updatedBy: userId,
    })
    .where(eq(racks.code, existingRack.code))
    .returning();

  return updatedData.code;
};

// ==================== UPDATE ====================

type UpdateRackParams = {
  code: string;
  data: {
    zoneCode?: string;
    name?: string;
    note?: string;
  };
  userId: string;
};

const update = async (params: UpdateRackParams) => {
  const { code, data, userId } = params;

  const existingRack = await db.query.racks.findFirst({
    where: and(eq(racks.code, code), eq(racks.isActive, true)),
  });

  if (!existingRack) {
    throw AppError.notFound('Rack not found');
  }

  if (data.zoneCode) {
    const parentZone = await db.query.zones.findFirst({
      where: and(eq(zones.code, data.zoneCode), eq(zones.isActive, true)),
    });

    if (!parentZone) {
      throw AppError.notFound('Zone not found');
    }
  }

  const [updatedData] = await db
    .update(racks)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(racks.code, code))
    .returning();

  return updatedData.code;
};

// ==================== DELETE ====================

type DeleteRackParams = {
  code: string;
  userId: string;
};

const remove = async (params: DeleteRackParams) => {
  const { code, userId } = params;

  const existingRack = await db.query.racks.findFirst({
    where: and(eq(racks.code, code), eq(racks.isActive, true)),
  });

  if (!existingRack) {
    throw AppError.notFound('Rack not found');
  }

  const existingShelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.rackCode, code), eq(shelves.isActive, true)),
  });

  if (existingShelf) {
    throw AppError.conflict('Rack has active shelves');
  }

  const [updatedData] = await db
    .update(racks)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(racks.code, existingRack.code))
    .returning();

  return updatedData.code;
};

// ==================== EXPORT ====================

export const rackService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
