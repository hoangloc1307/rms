import { z } from 'zod';

// ==================== REGISTER ====================

export const registerSchema = z.object({
  body: z.object({
    username: z.string({ error: 'Username is required' }).length(8, 'Username must be 8 characters').trim(),
    email: z.email({ error: 'Email is required' }),
    name: z.string({ error: 'Name is required' }).min(1, 'Name is required').trim(),
  }),
});

export type RegisterSchemaBody = z.infer<typeof registerSchema>['body'];

// ==================== LOGIN ====================

export const loginSchema = z.object({
  body: z.object({
    username: z.string({ error: 'Username is required' }).min(1, 'Username is required').trim(),
    password: z.string({ error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
  }),
});

export type LoginSchemaBody = z.infer<typeof loginSchema>['body'];

// ==================== GOOGLE LOGIN ====================

export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string({ error: 'ID token is required' }).min(1, 'ID token is required'),
  }),
});

export type GoogleLoginSchemaBody = z.infer<typeof googleLoginSchema>['body'];

// ==================== FORGOT PASSWORD ====================

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Email is required' }),
  }),
});

export type ForgotPasswordSchemaBody = z.infer<typeof forgotPasswordSchema>['body'];

// ==================== RESET PASSWORD ====================

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ error: 'Token is required' }).min(1, 'Token is required'),
    newPassword: z.string({ error: 'New password is required' }).min(8, 'Password must be at least 8 characters'),
  }),
});

export type ResetPasswordSchemaBody = z.infer<typeof resetPasswordSchema>['body'];

// ==================== CHANGE PASSWORD ====================

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ error: 'Old password is required' }).min(8, 'Password must be at least 8 characters'),
    newPassword: z.string({ error: 'New password is required' }).min(8, 'Password must be at least 8 characters'),
  }),
});

export type ChangePasswordSchemaBody = z.infer<typeof changePasswordSchema>['body'];
