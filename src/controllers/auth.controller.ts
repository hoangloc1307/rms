import { NextFunction, Response } from 'express';
import ms from 'ms';
import { env } from '~/configs';
import { KEYS } from '~/constants';
import { authService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';
import { LoginSchema } from '~/validations';

const login = async (req: TypedRequest<LoginSchema>, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
