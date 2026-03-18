import z from 'zod';

// ==================== GET ITEM MASTER DETAIL ====================

export const getItemMasterDetailSchema = z.object({
  params: z.object({
    itemCode: z.string().trim().min(1, 'Item code is required'),
  }),
});

export type GetItemMasterDetailSchemaParams = z.infer<typeof getItemMasterDetailSchema>['params'];

// ==================== CREATE ITEM MASTER ====================

export const createItemMasterSchema = z.object({
  body: z.object({
    itemCode: z.string().trim().min(1, 'Item code is required'),
    productCode: z.string().trim().min(1, 'Product code is required'),
    name: z.string().trim().min(1, 'Name is required'),
    unit: z.string().trim().min(1, 'Unit is required').toUpperCase(),
    baseUnit: z.string().trim().min(1, 'Base unit is required').toUpperCase(),
    conversionFactor: z.coerce.number().default(1),
    deliveryOnBaseUnit: z.boolean().default(true),
    note: z.string().trim().optional(),
  }),
});

export type CreateItemMasterSchemaBody = z.infer<typeof createItemMasterSchema>['body'];

// ==================== DELETE ITEM MASTER ====================

export const deleteItemMasterSchema = z.object({
  params: z.object({
    itemCode: z.string().trim().min(1, 'Item code is required'),
  }),
});

export type DeleteItemMasterSchemaParams = z.infer<typeof deleteItemMasterSchema>['params'];

// ==================== UPDATE ITEM MASTER ====================

export const updateItemMasterSchema = z.object({
  params: z.object({
    itemCode: z.string().trim().min(1, 'Item code is required'),
  }),
  body: z.object({
    productCode: z.string().trim().optional(),
    name: z.string().trim().optional(),
    unit: z.string().trim().toUpperCase().optional(),
    baseUnit: z.string().trim().toUpperCase().optional(),
    conversionFactor: z.coerce.number().optional(),
    deliveryOnBaseUnit: z.boolean().optional(),
    note: z.string().trim().optional(),
  }),
});

export type UpdateItemMasterSchemaParams = z.infer<typeof updateItemMasterSchema>['params'];
export type UpdateItemMasterSchemaBody = z.infer<typeof updateItemMasterSchema>['body'];
