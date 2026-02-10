import { Response } from 'express';
import { ERROR_CODE, HTTP_STATUS } from '../../enums';
import AppError from '../../errors/appError';
import { sendError } from '../../utils/response';

export function handleAppError(res: Response, err: AppError) {
  const status = err.httpStatusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const code = err.appCode ?? ERROR_CODE.INTERNAL_ERROR;

  if (typeof err.error === 'string') {
    return sendError(res, status, code, err.error);
  }

  return sendError(res, status, code, 'Error', err.error);
}
