import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '~/constants';
import { AppError } from '~/errors/app-error';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.httpStatusCode >= 500) {
      req.log.error({ err }, err.message);
    }

    return res.status(err.httpStatusCode).json({
      message: err.message,
      metadata: err.metadata,
      errorCode: err.errorCode,
    });
  }

  // Lỗi không xác định
  req.log.error({ err }, 'Unhandled error');

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};
