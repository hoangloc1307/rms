import z from 'zod';

const rackCodeSchema = z.string().trim().toUpperCase().min(1, 'Rack code is required').max(20);
const zoneCodeSchema = z.string().trim().toUpperCase().min(1, 'Zone code is required').max(20);

// ==================== GET RACK DETAIL ====================

export const getRackDetailSchema = z.object({
  params: z.object({
    code: rackCodeSchema,
  }),
});

export type GetRackDetailSchemaParams = z.infer<typeof getRackDetailSchema>['params'];

// ==================== LIST RACKS ====================

export const listRackSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    zoneCode: zoneCodeSchema.optional(),
  }),
});

export type ListRackSchemaQuery = z.infer<typeof listRackSchema>['query'];

// ==================== CREATE RACK ====================

export const createRackSchema = z.object({
  body: z.object({
    code: rackCodeSchema,
    zoneCode: zoneCodeSchema,
    name: z.string().trim().min(1, 'Rack name is required').max(150),
    note: z.string().trim().max(255).optional(),
  }),
});

export type CreateRackSchemaBody = z.infer<typeof createRackSchema>['body'];

// ==================== UPDATE RACK ====================

export const updateRackSchema = z.object({
  params: z.object({
    code: rackCodeSchema,
  }),
  body: z.object({
    zoneCode: zoneCodeSchema.optional(),
    name: z.string().trim().min(1).max(150).optional(),
    note: z.string().trim().max(255).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateRackSchemaParams = z.infer<typeof updateRackSchema>['params'];
export type UpdateRackSchemaBody = z.infer<typeof updateRackSchema>['body'];

// ==================== DELETE RACK ====================

export const deleteRackSchema = z.object({
  params: z.object({
    code: rackCodeSchema,
  }),
});

export type DeleteRackSchemaParams = z.infer<typeof deleteRackSchema>['params'];
