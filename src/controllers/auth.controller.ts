import { NextFunction, Response } from 'express';
import { prisma } from '~/database/prisma';
import { LoginSchema } from '~/schemas';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';

const login = async (req: TypedRequest<LoginSchema>, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    const user = await prisma.user.findUnique({ where: { userId: username } });
    ApiResponse.ok(res, 'OK', user);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
