import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { racks, shelfInventory, shelves } from '~/database/schemas';
import { AppError } from '~/errors';
import { ListShelfSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: ListShelfSchemaQuery) => {
  const { page, limit, search, rackCode } = query;

  const whereCondition = and(
    eq(shelves.isActive, true),
    rackCode ? eq(shelves.rackCode, rackCode) : undefined,
    search ? or(like(shelves.code, `%${search}%`), like(shelves.name, `%${search}%`)) : undefined,
  );

  const dataPromise = db.query.shelves.findMany({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(shelves).where(whereCondition);

  const [data, [{ total }]] = await Promise.all([dataPromise, totalPromise]);

  return { data, total };
};

// ==================== GET DETAIL ====================

const getDetail = async (code: string) => {
  const data = await db.query.shelves.findFirst({
    where: and(eq(shelves.code, code), eq(shelves.isActive, true)),
    with: {
      rack: {
        columns: {
          code: true,
          name: true,
        },
      },
    },
  });

  if (!data) {
    throw AppError.notFound('Shelf not found');
  }

  return { data };
};

// ==================== CREATE ====================

type CreateShelfParams = {
  data: {
    code: string;
    rackCode: string;
    name: string;
    level: number;
    note?: string;
  };
  userId: string;
};

const create = async (params: CreateShelfParams) => {
  const { data, userId } = params;

  const [existingShelf, parentRack] = await Promise.all([
    db.query.shelves.findFirst({
      where: eq(shelves.code, data.code),
    }),
    db.query.racks.findFirst({
      where: and(eq(racks.code, data.rackCode), eq(racks.isActive, true)),
    }),
  ]);

  if (!parentRack) {
    throw AppError.notFound('Rack not found');
  }

  if (!existingShelf) {
    const [insertedData] = await db
      .insert(shelves)
      .values({
        ...data,
        createdBy: userId,
      })
      .returning();

    return insertedData.code;
  }

  if (existingShelf.isActive) {
    throw AppError.conflict('Shelf already exists');
  }

  const [updatedData] = await db
    .update(shelves)
    .set({
      ...data,
      isActive: true,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(shelves.code, existingShelf.code))
    .returning();

  return updatedData.code;
};

// ==================== UPDATE ====================

type UpdateShelfParams = {
  code: string;
  data: {
    rackCode?: string;
    name?: string;
    note?: string;
    level?: number;
  };
  userId: string;
};

const update = async (params: UpdateShelfParams) => {
  const { code, data, userId } = params;

  const existingShelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.code, code), eq(shelves.isActive, true)),
  });

  if (!existingShelf) {
    throw AppError.notFound('Shelf not found');
  }

  if (data.rackCode) {
    const parentRack = await db.query.racks.findFirst({
      where: and(eq(racks.code, data.rackCode), eq(racks.isActive, true)),
    });

    if (!parentRack) {
      throw AppError.notFound('Rack not found');
    }
  }

  const [updatedData] = await db
    .update(shelves)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(shelves.code, code))
    .returning();

  return updatedData.code;
};

// ==================== DELETE ====================

type DeleteShelfParams = {
  code: string;
  userId: string;
};

const remove = async (params: DeleteShelfParams) => {
  const { code, userId } = params;

  const existingShelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.code, code), eq(shelves.isActive, true)),
  });

  if (!existingShelf) {
    throw AppError.notFound('Shelf not found');
  }

  const existingItem = await db.query.shelfInventory.findFirst({
    where: and(eq(shelfInventory.shelfCode, code), eq(shelfInventory.isActive, true)),
  });

  if (existingItem) {
    throw AppError.conflict('Shelf is not empty');
  }

  const [updatedData] = await db
    .update(shelves)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy: userId,
    })
    .where(eq(shelves.code, code))
    .returning();

  return updatedData.code;
};

// ==================== EXPORT ====================

export const shelfService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
