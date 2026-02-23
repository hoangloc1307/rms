import type { HttpStatus } from '~/constants';

interface AppErrorOptions {
  httpStatusCode: HttpStatus;
  message: string;
  errorCode?: string;
  metadata?: unknown;
}

export class AppError extends Error {
  public readonly httpStatusCode: HttpStatus;
  public readonly errorCode: string;
  public readonly metadata?: unknown;

  constructor({ httpStatusCode, message, errorCode, metadata }: AppErrorOptions) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode || 'INTERNAL_SERVER_ERROR';
    this.metadata = metadata;
  }
}
