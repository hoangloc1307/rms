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
    trackingType: z.enum(['LABEL', 'QUANTITY']),
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

// ==================== IMPORT ITEM MASTER ====================

export const itemMasterImportSchema = z.object({
  itemCode: z.coerce
    .string()
    .trim()
    .min(1, 'Item code is required')
    .max(10, 'Item code must be at most 10 characters long'),
  productCode: z.coerce
    .string()
    .trim()
    .min(1, 'Product code is required')
    .max(4, 'Product code must be at most 4 characters long'),
  name: z.string().trim().min(1, 'Name is required').max(150, 'Name must be at most 150 characters long'),
  unit: z.string().trim().toUpperCase().min(1, 'Unit is required').max(20, 'Unit must be at most 20 characters long'),
  baseUnit: z.coerce
    .string()
    .trim()
    .toUpperCase()
    .min(1, 'Base unit is required')
    .max(20, 'Base unit must be at most 20 characters long'),
  conversionFactor: z.coerce.number().positive('Conversion factor must be greater than 0').default(1),
  deliveryOnBaseUnit: z
    .enum(['Y', 'N'])
    .transform((value) => value === 'Y')
    .default(true),
  note: z.string().trim().max(255, 'Note must be at most 255 characters long').optional().nullable(),
  trackingType: z.enum(['LABEL', 'QUANTITY']),
});

export type ItemMasterImportInput = z.infer<typeof itemMasterImportSchema>;

// ==================== COMMIT IMPORT ITEM MASTER ====================

export const commitItemMasterImportSchema = z.object({
  params: z.object({
    token: z.string().trim().min(1, 'Import token is required'),
  }),
});

export type CommitItemMasterImportSchemaParams = z.infer<typeof commitItemMasterImportSchema>['params'];
