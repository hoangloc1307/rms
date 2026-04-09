import z from 'zod';

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
  }),
});

export type PaginationSchemaQuery = z.infer<typeof paginationSchema>['query'];
