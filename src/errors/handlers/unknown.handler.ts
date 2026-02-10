import { Response } from 'express';
import { ERROR_CODE, HTTP_STATUS } from '../../enums';
import { sendError } from '../../utils/response';

export function handleUnknown(res: Response, err: any) {
  const status = err?.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const code = err?.code ?? ERROR_CODE.INTERNAL_ERROR;

  // Chỉ echo message khi status < 500 để tránh lộ chi tiết
  const message =
    typeof err?.message === 'string' && status < 500
      ? err.message
      : 'Internal Server Error';

  return sendError(res, status, code, message);
}
