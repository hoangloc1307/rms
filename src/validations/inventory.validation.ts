import z from 'zod';

// ==================== CHECK LABEL EXISTS ====================

export const checkLabelExistsSchema = z.object({
  params: z.object({
    labelId: z.string().trim().min(1, 'Label ID is required'),
  }),
});

export type CheckLabelExistsSchemaParams = z.infer<typeof checkLabelExistsSchema>['params'];
