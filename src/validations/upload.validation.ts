import { z } from 'zod';

export const getUploadUrlSchema = z.object({
  filename: z.string({ error: 'Filename is required' }).min(1, 'Filename is required').trim(),
  contentType: z.string({ error: 'Content type is required' }).min(1, 'Content type is required').trim(),
});

export type GetUploadUrlSchema = z.infer<typeof getUploadUrlSchema>;
