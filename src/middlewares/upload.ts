import { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { uploadConfig } from '../config';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';

export const upload = multer(uploadConfig);

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return next(
          new AppError(
            ERROR_CODE.LIMIT_FILE_SIZE,
            'File vượt quá kích thước cho phép',
            HTTP_STATUS.CONTENT_TOO_LARGE
          )
        );

      default:
        return next(
          new AppError(
            ERROR_CODE.UPLOAD_ERROR,
            err.message,
            HTTP_STATUS.BAD_REQUEST
          )
        );
    }
  }

  next(err);
}
