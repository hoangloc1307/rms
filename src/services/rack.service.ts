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

  const [data, [totalData]] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData.total };
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
  createdBy: string;
};

const create = async (params: CreateRackParams) => {
  const { data, createdBy } = params;
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
        createdBy,
      })
      .returning();

    return insertedData.code;
  }

  if (existingRack.isActive) {
    throw AppError.conflict('Rack already exists');
  }

  await db.transaction(async (tx) => {
    const [restoredRack] = await tx
      .update(racks)
      .set({
        ...data,
        isActive: true,
        updatedAt: now,
        updatedBy: createdBy,
      })
      .where(eq(racks.code, existingRack.code))
      .returning();

    await tx
      .update(shelves)
      .set({
        isActive: true,
        updatedAt: now,
        updatedBy: createdBy,
      })
      .where(eq(shelves.rackCode, existingRack.code));

    return restoredRack;
  });
};

// ==================== UPDATE ====================

type UpdateRackParams = {
  code: string;
  data: {
    zoneCode?: string;
    name?: string;
    note?: string;
  };
  updatedBy: string;
};

const update = async (params: UpdateRackParams) => {
  const { code, data, updatedBy } = params;

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
      updatedBy,
    })
    .where(eq(racks.code, code))
    .returning();

  return updatedData.code;
};

// ==================== DELETE ====================

type DeleteRackParams = {
  code: string;
  updatedBy: string;
};

const remove = async (params: DeleteRackParams) => {
  const { code, updatedBy } = params;
  const now = new Date();

  const existingRack = await db.query.racks.findFirst({
    where: and(eq(racks.code, code), eq(racks.isActive, true)),
  });

  if (!existingRack) {
    throw AppError.notFound('Rack not found');
  }

  await db.transaction(async (tx) => {
    const [removedRack] = await tx
      .update(racks)
      .set({
        isActive: false,
        updatedAt: now,
        updatedBy,
      })
      .where(eq(racks.code, existingRack.code))
      .returning();

    await tx
      .update(shelves)
      .set({
        isActive: false,
        updatedAt: now,
        updatedBy,
      })
      .where(eq(shelves.rackCode, existingRack.code));

    return removedRack;
  });
};

// ==================== EXPORT ====================

export const rackService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
