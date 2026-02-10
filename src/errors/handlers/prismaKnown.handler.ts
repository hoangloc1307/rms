import { Response } from 'express';
import { ERROR_CODE, HTTP_STATUS } from '../../enums';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';
import { sendError } from '../../utils/response';

const MAP: Record<string, { status: number; code: string; message: string }> = {
  P2002: {
    status: HTTP_STATUS.CONFLICT,
    code: ERROR_CODE.CONFLICT,
    message: 'Resource already exists.',
  },
  P2025: {
    status: HTTP_STATUS.NOT_FOUND,
    code: ERROR_CODE.NOT_FOUND,
    message: 'Resource not found.',
  },
  P2003: {
    status: HTTP_STATUS.BAD_REQUEST,
    code: ERROR_CODE.BAD_REQUEST,
    message: 'Constraint violation.',
  },
  P2028: {
    status: HTTP_STATUS.SERVICE_UNAVAILABLE,
    code: ERROR_CODE.INTERNAL_ERROR,
    message: 'Temporary database issue. Please try again.',
  },
};

export function handlePrismaKnown(
  res: Response,
  err: PrismaClientKnownRequestError
) {
  const mapped = MAP[err.code] ?? {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ERROR_CODE.INTERNAL_ERROR,
    message: 'Database error.',
  };

  return sendError(res, mapped.status, mapped.code, mapped.message);
}
