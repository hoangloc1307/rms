import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import AppError from '../errors/appError';
import { handleAppError } from '../errors/handlers/appError.handler';
import { handleJsonWebTokenError } from '../errors/handlers/jsonwebtoken.handler';
import { handlePrismaKnown } from '../errors/handlers/prismaKnown.handler';
import { handleUnknown } from '../errors/handlers/unknown.handler';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace';

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (true) {
    case err instanceof AppError:
      return handleAppError(res, err);
    case err instanceof PrismaClientKnownRequestError:
      return handlePrismaKnown(res, err);
    case err instanceof JsonWebTokenError:
      return handleJsonWebTokenError(res, err);
    default:
      return handleUnknown(res, err);
  }
}
