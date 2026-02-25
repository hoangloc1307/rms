import { Request, Response, NextFunction } from 'express';
import { AppError } from '~/errors/app-error';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
