import z from 'zod';

// ==================== GET IMPORT BY CODE ====================

export const getImportByCodeSchema = z.object({
  params: z.object({
    code: z.string().trim().min(1, 'Code is required'),
  }),
});

export type GetImportByCodeSchemaParams = z.infer<typeof getImportByCodeSchema>['params'];

// ==================== COMMIT IMPORT ====================

export const commitImportSchema = z.object({
  params: z.object({
    token: z.string().trim().min(1, 'Import token is required'),
  }),
  body: z.object({
    type: z.string().trim().min(1, 'Type is required'),
  }),
});

export type CommitImportSchemaParams = z.infer<typeof commitImportSchema>['params'];
export type CommitImportSchemaBody = z.infer<typeof commitImportSchema>['body'];
