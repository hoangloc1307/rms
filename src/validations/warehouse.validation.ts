import z from 'zod';

const warehouseCodeSchema = z.string().trim().toUpperCase().min(1, 'Warehouse code is required').max(20);

// ==================== GET WAREHOUSE DETAIL ====================

export const getWarehouseDetailSchema = z.object({
  params: z.object({
    code: warehouseCodeSchema,
  }),
});

export type GetWarehouseDetailSchemaParams = z.infer<typeof getWarehouseDetailSchema>['params'];

// ==================== LIST WAREHOUSES ====================

export const listWarehouseSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
  }),
});

export type ListWarehouseSchemaQuery = z.infer<typeof listWarehouseSchema>['query'];

// ==================== CREATE WAREHOUSE ====================

export const createWarehouseSchema = z.object({
  body: z.object({
    code: warehouseCodeSchema,
    name: z.string().trim().min(1, 'Warehouse name is required').max(150),
    note: z.string().trim().max(255).optional(),
  }),
});

export type CreateWarehouseSchemaBody = z.infer<typeof createWarehouseSchema>['body'];

// ==================== UPDATE WAREHOUSE ====================

export const updateWarehouseSchema = z.object({
  params: z.object({
    code: warehouseCodeSchema,
  }),
  body: z.object({
    name: z.string().trim().min(1).max(150).optional(),
    note: z.string().trim().max(255).optional(),
  }),
});

export type UpdateWarehouseSchemaParams = z.infer<typeof updateWarehouseSchema>['params'];
export type UpdateWarehouseSchemaBody = z.infer<typeof updateWarehouseSchema>['body'];

// ==================== DELETE WAREHOUSE ====================

export const deleteWarehouseSchema = z.object({
  params: z.object({
    code: warehouseCodeSchema,
  }),
});

export type DeleteWarehouseSchemaParams = z.infer<typeof deleteWarehouseSchema>['params'];
