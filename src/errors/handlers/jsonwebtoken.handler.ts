import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ERROR_CODE, HTTP_STATUS } from '../../enums';
import { sendError } from '../../utils/response';

export function handleJsonWebTokenError(res: Response, err: JsonWebTokenError) {
  const status = HTTP_STATUS.UNAUTHORIZED;
  const code = ERROR_CODE.UNAUTHORIZED;

  return sendError(res, status, code, err.message);
}
