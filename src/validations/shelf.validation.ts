import z from 'zod';

const shelfCodeSchema = z.string().trim().toUpperCase().min(1, 'Shelf code is required').max(20);
const rackCodeSchema = z.string().trim().toUpperCase().min(1, 'Rack code is required').max(20);

// ==================== GET SHELF DETAIL ====================

export const getShelfDetailSchema = z.object({
  params: z.object({
    code: shelfCodeSchema,
  }),
});

export type GetShelfDetailSchemaParams = z.infer<typeof getShelfDetailSchema>['params'];

// ==================== LIST SHELFS ====================

export const listShelfSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    rackCode: rackCodeSchema.optional(),
  }),
});

export type ListShelfSchemaQuery = z.infer<typeof listShelfSchema>['query'];

// ==================== CREATE SHELF ====================

export const createShelfSchema = z.object({
  body: z.object({
    code: shelfCodeSchema,
    rackCode: rackCodeSchema,
    name: z.string().trim().min(1, 'Shelf name is required').max(150),
    note: z.string().trim().max(255).optional(),
    level: z.coerce.number(),
  }),
});

export type CreateShelfSchemaBody = z.infer<typeof createShelfSchema>['body'];

// ==================== UPDATE SHELF ====================

export const updateShelfSchema = z.object({
  params: z.object({
    code: shelfCodeSchema,
  }),
  body: z.object({
    rackCode: rackCodeSchema.optional(),
    name: z.string().trim().min(1).max(150).optional(),
    note: z.string().trim().max(255).optional(),
    level: z.coerce.number().optional(),
  }),
});

export type UpdateShelfSchemaParams = z.infer<typeof updateShelfSchema>['params'];
export type UpdateShelfSchemaBody = z.infer<typeof updateShelfSchema>['body'];

// ==================== DELETE SHELF ====================

export const deleteShelfSchema = z.object({
  params: z.object({
    code: shelfCodeSchema,
  }),
});

export type DeleteShelfSchemaParams = z.infer<typeof deleteShelfSchema>['params'];
