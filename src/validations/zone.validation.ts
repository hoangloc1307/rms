import z from 'zod';
import { paginationQuerySchema } from '~/validations/pagination.validation';

const zoneCodeSchema = z.string().trim().toUpperCase().min(1, 'Zone code is required').max(20);
const warehouseCodeSchema = z.string().trim().toUpperCase().min(1, 'Warehouse code is required').max(20);

// ==================== GET ZONE DETAIL ====================

export const getZoneDetailSchema = z.object({
  params: z.object({
    code: zoneCodeSchema,
  }),
});

export type GetZoneDetailSchemaParams = z.infer<typeof getZoneDetailSchema>['params'];

// ==================== LIST ZONES ====================

export const listZoneSchema = z.object({
  query: paginationQuerySchema.extend({
    warehouseCode: warehouseCodeSchema.optional(),
  }),
});

export type ListZoneSchemaQuery = z.infer<typeof listZoneSchema>['query'];

// ==================== CREATE ZONE ====================

export const createZoneSchema = z.object({
  body: z.object({
    code: zoneCodeSchema,
    warehouseCode: warehouseCodeSchema,
    name: z.string().trim().min(1, 'Zone name is required').max(150),
    note: z.string().trim().max(255).optional(),
  }),
});

export type CreateZoneSchemaBody = z.infer<typeof createZoneSchema>['body'];

// ==================== UPDATE ZONE ====================

export const updateZoneSchema = z.object({
  params: z.object({
    code: zoneCodeSchema,
  }),
  body: z.object({
    warehouseCode: warehouseCodeSchema.optional(),
    name: z.string().trim().min(1).max(150).optional(),
    note: z.string().trim().max(255).optional(),
  }),
});

export type UpdateZoneSchemaParams = z.infer<typeof updateZoneSchema>['params'];
export type UpdateZoneSchemaBody = z.infer<typeof updateZoneSchema>['body'];

// ==================== DELETE ZONE ====================

export const deleteZoneSchema = z.object({
  params: z.object({
    code: zoneCodeSchema,
  }),
});

export type DeleteZoneSchemaParams = z.infer<typeof deleteZoneSchema>['params'];
