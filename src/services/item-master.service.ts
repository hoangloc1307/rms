import { count, like, or } from 'drizzle-orm';
import { db } from '~/database';
import { itemMasters } from '~/database/schemas';
import { PaginationSchemaQuery } from '~/validations';

const getAll = async (query: PaginationSchemaQuery) => {
  const { page, limit, search, sortBy, sortOrder } = query;

  const whereCondition = search
    ? or(
        like(itemMasters.name, `%${search}%`),
        like(itemMasters.productCode, `%${search}%`),
        like(itemMasters.unit, `%${search}%`),
        like(itemMasters.baseUnit, `%${search}%`),
      )
    : undefined;

  const dataPromise = db.query.itemMasters.findMany({
    where: whereCondition,
    orderBy: (itemMasters, { asc, desc }) => {
      const column = itemMasters[sortBy as keyof typeof itemMasters];
      return sortOrder === 'desc' ? desc(column) : asc(column);
    },
    limit,
    offset: (page - 1) * limit,
  });

  const totalPromise = db.select({ total: count() }).from(itemMasters).where(whereCondition);

  const [data, totalData] = await Promise.all([dataPromise, totalPromise]);

  return { data, total: totalData[0].total };
};

export const itemMasterService = { getAll };
