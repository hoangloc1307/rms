import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { racks, shelfts } from '~/database/schemas';
import { AppError } from '~/errors';
import { ListShelfSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (query: ListShelfSchemaQuery) => {
  const { page, limit, search, rackCode } = query;

  const whereCondition = and(
    eq(shelfts.isActive, true),
    rackCode ? eq(shelfts.rackCode, rackCode) : undefined,
    search ? or(like(shelfts.code, `%${search}%`), like(shelfts.name, `%${search}%`)) : undefined,
  );

  const dataPromise = db.query.shelfts.findMany({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(shelfts).where(whereCondition);

  const [data, totalData] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData[0].total };
};

// ==================== GET DETAIL ====================

const getDetail = async (code: string) => {
  const data = await db.query.shelfts.findFirst({
    where: and(eq(shelfts.code, code), eq(shelfts.isActive, true)),
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
  createdBy: string;
};

const create = async (params: CreateShelfParams) => {
  const { data, createdBy } = params;

  const [existingShelf, parentRack] = await Promise.all([
    db.query.shelfts.findFirst({
      where: eq(shelfts.code, data.code),
    }),
    db.query.racks.findFirst({
      where: and(eq(racks.code, data.rackCode), eq(racks.isActive, true)),
    }),
  ]);

  if (!parentRack) {
    throw AppError.notFound('Rack not found');
  }

  if (!existingShelf) {
    const insertedData = await db
      .insert(shelfts)
      .values({
        ...data,
        createdBy,
      })
      .returning();

    return insertedData[0].code;
  }

  if (existingShelf.isActive) {
    throw AppError.conflict('Shelf already exists');
  }

  const updatedData = await db
    .update(shelfts)
    .set({
      ...data,
      isActive: true,
      updatedAt: new Date(),
      updatedBy: createdBy,
    })
    .where(eq(shelfts.code, existingShelf.code))
    .returning();

  return updatedData[0].code;
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
  updatedBy: string;
};

const update = async (params: UpdateShelfParams) => {
  const { code, data, updatedBy } = params;

  const existingShelf = await db.query.shelfts.findFirst({
    where: and(eq(shelfts.code, code), eq(shelfts.isActive, true)),
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

  const updatedData = await db
    .update(shelfts)
    .set({
      ...data,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(shelfts.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== DELETE ====================

type DeleteShelfParams = {
  code: string;
  updatedBy: string;
};

const remove = async (params: DeleteShelfParams) => {
  const { code, updatedBy } = params;

  const existingShelf = await db.query.shelfts.findFirst({
    where: and(eq(shelfts.code, code), eq(shelfts.isActive, true)),
  });

  if (!existingShelf) {
    throw AppError.notFound('Shelf not found');
  }

  const updatedData = await db
    .update(shelfts)
    .set({
      isActive: false,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(shelfts.code, code))
    .returning();

  return updatedData[0].code;
};

// ==================== EXPORT ====================

export const shelfService = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
