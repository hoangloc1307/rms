import z from 'zod';

// ==================== GET ALL ====================

export const getNotificationSchema = z.object({
  query: z.object({
    limit: z.coerce.number<number>().min(1).max(100).default(10),
    cursor: z.string().optional(),
    isRead: z.coerce.boolean().optional(),
    type: z.enum(['TASK', 'IMPORT', 'SYSTEM']).optional(),
    entityType: z.enum(['IMPORT', 'TASK']).optional(),
  }),
});

export type GetNotificationSchemaQuery = z.infer<typeof getNotificationSchema>['query'];

// ==================== MARK AS READ ====================

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export type MarkAsReadSchemaParams = z.infer<typeof markAsReadSchema>['params'];
