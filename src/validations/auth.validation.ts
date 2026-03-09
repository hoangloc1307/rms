import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string({ error: 'Username is required' }).min(1, 'Username is required').trim(),
  password: z.string({ error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const googleLoginSchema = z.object({
  idToken: z.string({ error: 'ID token is required' }).min(1, 'ID token is required'),
});

export type GoogleLoginSchema = z.infer<typeof googleLoginSchema>;
