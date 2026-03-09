import { NextFunction, Request, Response } from 'express';
import { AppError } from '~/errors';
import { verifyAccessToken } from '~/utils';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.url === '/api/auth/login') return next();

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    throw AppError.unauthorized('Invalid token');
  }
};
