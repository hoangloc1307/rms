import { ERROR_CODE, HTTP_STATUS } from '../enums';

export default class AppError extends Error {
  appCode: ERROR_CODE;
  httpStatusCode: HTTP_STATUS;
  error: string | object;

  constructor(
    appCode: ERROR_CODE,
    error: string | object,
    httpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super();
    this.appCode = appCode;
    this.httpStatusCode = httpStatusCode;
    this.error = error || 'Error';
  }
}
