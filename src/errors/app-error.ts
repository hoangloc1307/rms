import { HTTP_STATUS, type HttpStatus } from '~/constants';

interface AppErrorOptions {
  httpStatusCode: HttpStatus;
  message: string;
  errorCode: string;
  isOperational?: boolean;
  metadata?: unknown;
}

export class AppError extends Error {
  public readonly httpStatusCode: HttpStatus;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly metadata?: unknown;

  constructor({ httpStatusCode, message, errorCode, metadata, isOperational = true }: AppErrorOptions) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
    this.metadata = metadata;
    this.isOperational = isOperational;
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError({ httpStatusCode: HTTP_STATUS.UNAUTHORIZED, message, errorCode: 'UNAUTHORIZED' });
  }

  static forbidden(message = 'Forbidden') {
    return new AppError({ httpStatusCode: HTTP_STATUS.FORBIDDEN, message, errorCode: 'FORBIDDEN' });
  }

  static notFound(message = 'Not Found') {
    return new AppError({ httpStatusCode: HTTP_STATUS.NOT_FOUND, message, errorCode: 'NOT_FOUND' });
  }

  static badRequest(message = 'Bad Request', metadata?: unknown) {
    return new AppError({ httpStatusCode: HTTP_STATUS.BAD_REQUEST, message, errorCode: 'BAD_REQUEST', metadata });
  }

  static conflict(message = 'Conflict') {
    return new AppError({ httpStatusCode: HTTP_STATUS.CONFLICT, message, errorCode: 'CONFLICT' });
  }

  static server(message = 'Internal Server Error') {
    return new AppError({
      httpStatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message,
      errorCode: 'INTERNAL_SERVER_ERROR',
    });
  }
}
