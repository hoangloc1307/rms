import { Request, Response } from 'express';
import ms from 'ms';
import { env } from '~/configs';
import { KEYS } from '~/constants';
import { AppError } from '~/errors';
import { addSendMailJob } from '~/helpers';
import { authService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  ChangePasswordSchemaBody,
  ForgotPasswordSchemaBody,
  GoogleLoginSchemaBody,
  LoginSchemaBody,
  RegisterSchemaBody,
  ResetPasswordSchemaBody,
} from '~/validations';

// ==================== REGISTER ====================

const register = async (req: Request, res: Response) => {
  const { username, email, name } = req.validatedData?.body as RegisterSchemaBody;

  const createdUser = await authService.register({ username, email, name });

  await addSendMailJob({
    subject: 'Create account successfully!',
    to: [createdUser.email!],
    template: 'register',
    data: {
      name: createdUser.name,
      email: createdUser.email,
      username: createdUser.username,
      password: createdUser.password,
    },
  });

  ApiResponse.created(res, 'Register successfully!');
};

// ==================== LOGIN ====================

const login = async (req: Request, res: Response) => {
  const { username, password } = req.validatedData?.body as LoginSchemaBody;

  const { accessToken, refreshToken } = await authService.login({ username, password });

  res.cookie(KEYS.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === KEYS.PRODUCTION,
    sameSite: 'lax',
    maxAge: ms('7d'),
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Login successfully!', { accessToken });
};

// ==================== REFRESH TOKEN ====================

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[KEYS.REFRESH_TOKEN] as string;

  if (!refreshToken) {
    throw AppError.unauthorized('Refresh token not found');
  }

  const { accessToken } = await authService.refresh(refreshToken);

  res.cookie(KEYS.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === KEYS.PRODUCTION,
    sameSite: 'lax',
    maxAge: ms('7d'),
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Refresh successfully!', { accessToken });
};

// ==================== LOGOUT ====================

const logout = (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized('User not found');
  }

  res.clearCookie(KEYS.REFRESH_TOKEN, {
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Logout successfully!');
};

// ==================== GOOGLE LOGIN ====================

const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.validatedData?.body as GoogleLoginSchemaBody;

  const { accessToken, refreshToken } = await authService.googleLogin(idToken);

  res.cookie(KEYS.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === KEYS.PRODUCTION,
    sameSite: 'lax',
    maxAge: ms('7d'),
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Login successfully!', { accessToken });
};

// ==================== FORGOT PASSWORD ====================

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.validatedData?.body as ForgotPasswordSchemaBody;

  const { token, name, email: userEmail } = await authService.forgotPassword(email);

  await addSendMailJob({
    subject: 'Password Reset Request',
    to: [userEmail!],
    template: 'forgot-password',
    data: { name, token },
  });

  ApiResponse.ok(res, 'Password reset instructions have been sent to your email.');
};

// ==================== RESET PASSWORD ====================

const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.validatedData?.body as ResetPasswordSchemaBody;

  await authService.resetPassword({ token, newPassword });

  ApiResponse.ok(res, 'Password has been reset successfully.');
};

// ==================== CHANGE PASSWORD ====================

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.validatedData?.body as ChangePasswordSchemaBody;

  await authService.changePassword({ userId: req.user?.userId, oldPassword, newPassword });

  ApiResponse.ok(res, 'Password has been changed successfully.');
};

// ==================== EXPORT ====================

export const authController = {
  register,
  login,
  refresh,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
};
