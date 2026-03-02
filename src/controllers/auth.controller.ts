import { NextFunction, Response } from 'express';
import { LoginSchema } from '~/schemas';
import { authService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';

const login = async (req: TypedRequest<LoginSchema>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(username, password);
    ApiResponse.ok(res, 'Login successfully!', { accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
