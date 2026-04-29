import z from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

export const paginationSchema = z.object({
  query: paginationQuerySchema,
});

export type PaginationSchemaQuery = z.infer<typeof paginationSchema>['query'];
