import { Request, Response } from 'express';
import ms from 'ms';
import { env } from '~/configs';
import { KEYS } from '~/constants';
import { AppError } from '~/errors';
import { authService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';
import { GoogleLoginSchema, LoginSchema } from '~/validations';

const login = async (req: TypedRequest<LoginSchema>, res: Response) => {
  const { username, password } = req.body;

  const { accessToken, refreshToken } = await authService.login(username, password);

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
  res.clearCookie(KEYS.REFRESH_TOKEN, {
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, 'Logout successfully!');
};

const googleLogin = async (req: TypedRequest<GoogleLoginSchema>, res: Response) => {
  const { idToken } = req.body;

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

export const authController = {
  login,
  refresh,
  logout,
  googleLogin,
};
