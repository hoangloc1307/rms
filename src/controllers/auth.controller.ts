import { NextFunction, Response } from 'express';
import { LoginSchema } from '~/schemas';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';

const login = (req: TypedRequest<LoginSchema>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    ApiResponse.ok(res, 'OK', { username, password });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
