import z from 'zod';

// ==================== GET IMPORT BY CODE ====================

export const getImportByCodeSchema = z.object({
  params: z.object({
    code: z.string().trim().min(1, 'Code is required'),
  }),
});

export type GetImportByCodeSchemaParams = z.infer<typeof getImportByCodeSchema>['params'];
