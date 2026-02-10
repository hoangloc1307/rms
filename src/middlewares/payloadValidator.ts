import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';

export default function payloadValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorObj = errors
      .array({ onlyFirstError: true })
      .reduce((result: any, item: ValidationError) => {
        return { ...result, [(item as FieldValidationError).path]: item.msg };
      }, {});

    next(
      new AppError(ERROR_CODE.PAYLOAD_ERROR, errorObj, HTTP_STATUS.BAD_REQUEST)
    );
  }

  next();
}
