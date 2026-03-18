import z from 'zod';

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export type PaginationSchemaQuery = z.infer<typeof paginationSchema>['query'];
