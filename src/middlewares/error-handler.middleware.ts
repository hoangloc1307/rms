import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS, HttpStatus } from '~/constants';
import { AppError } from '~/errors/app-error';
import { logger } from '~/utils';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  let statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let metadata: unknown;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (err instanceof AppError) {
    statusCode = err.httpStatusCode;
    message = err.message;
    metadata = err.metadata;
    errorCode = err.errorCode;
  }

  if (statusCode >= 500) {
    logger.error({
      err,
      requestId: req.id,
      method: req.method,
      url: req.url,
    });
  }

  const response = {
    success: false,
    message,
    metadata,
    errorCode,
  };

  return res.status(statusCode).json(response);
};
