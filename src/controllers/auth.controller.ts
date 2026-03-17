import { Request, Response } from 'express';
import ms from 'ms';
import { env } from '~/configs';
import { KEYS } from '~/constants';
import { AppError } from '~/errors';
import { addSendMailJob } from '~/helpers';
import { authService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';
import { GoogleLoginSchemaBody, LoginSchemaBody, RegisterSchemaBody } from '~/validations';

const register = async (req: TypedRequest<RegisterSchemaBody>, res: Response) => {
  const { username, email, name } = req.body;

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

  ApiResponse.ok(res, 'Register successfully!');
};

const login = async (req: TypedRequest<LoginSchemaBody>, res: Response) => {
  const { username, password } = req.body;

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

const logout = (req: Request, res: Response) => {
  const refreshToken = req.cookies[KEYS.REFRESH_TOKEN] as string;

  if (!refreshToken) {
    throw AppError.unauthorized('Refresh token not found');
  }

  res.clearCookie(KEYS.REFRESH_TOKEN, {
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Logout successfully!');
};

const googleLogin = async (req: TypedRequest<GoogleLoginSchemaBody>, res: Response) => {
  const { idToken } = req.body;

  const { accessToken, refreshToken } = await authService.googleLogin({ idToken });

  res.cookie(KEYS.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: env.ENVIRONMENT === KEYS.PRODUCTION,
    sameSite: 'lax',
    maxAge: ms('7d'),
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Login successfully!', { accessToken });
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  googleLogin,
};
