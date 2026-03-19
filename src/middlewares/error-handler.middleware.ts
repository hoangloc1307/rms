import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { HTTP_STATUS, HttpStatus } from '~/constants';
import { AppError, normalizeBodyParserError } from '~/errors';
import { logger } from '~/utils';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  err = normalizeBodyParserError(err);

  let statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let metadata: unknown;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (err instanceof AppError) {
    statusCode = err.httpStatusCode;
    message = err.message;
    metadata = err.metadata;
    errorCode = err.errorCode;
  } else if (err instanceof MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        statusCode = HTTP_STATUS.CONTENT_TOO_LARGE;
        message = err.message;
        errorCode = 'LIMIT_FILE_SIZE';
        break;

      default:
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = err.message;
        errorCode = err.code;
    }
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
