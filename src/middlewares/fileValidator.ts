import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { FILE_EXTENSION } from '../constants/fileType';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';

interface FileRule {
  field: string; // tên field: 'avatar', 'front', 'attachments'...
  required?: boolean; // bắt buộc hay không
  allow?: FILE_EXTENSION[]; // yêu cầu loại file nào
  maxSize?: number; // bytes
  minCount?: number; // tối thiểu bao nhiêu file (cho array/fields)
  maxCount?: number; // tối đa bao nhiêu file
}

// Gom tất cả trường hợp Multer (.single/.array/.fields)
function getFilesFromReq(req: Request, field: string): Express.Multer.File[] {
  // .single() -> 1 field 1 file
  if (req.file && req.file.fieldname === field) return [req.file];

  const f = req.files as any;
  if (!f) return [];

  // .array('field') -> 1 field nhiều file
  if (Array.isArray(f)) {
    return (f as Express.Multer.File[]).filter((x) => x.fieldname === field);
  }

  // .fields()  -> nhiều field nhiều file
  if (f[field]) return f[field] as Express.Multer.File[];

  return [];
}

// Từ rule → ra tập MIME & EXT được phép (set để check nhanh)
function resolveAllowed(allow: FILE_EXTENSION[]): {
  mimes: Set<string>;
  exts: Set<string>;
} {
  const mimes = new Set<string>();
  const exts = new Set<string>();

  if (allow?.length) {
    for (const type of allow) {
      const fileType = FILE_EXTENSION[type];
      if (fileType) {
        mimes.add(fileType.mime);
        fileType.exts.forEach((x) => exts.add(x));
      }
    }
  }

  return { mimes, exts };
}

export function fileValidator(rules: FileRule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const rule of rules) {
      const files = getFilesFromReq(req, rule.field);

      // required
      if (rule.required && files.length === 0) {
        return next(
          new AppError(
            ERROR_CODE.PAYLOAD_ERROR,
            { [rule.field]: `${rule.field} is required` },
            HTTP_STATUS.BAD_REQUEST
          )
        );
      }

      // min count
      if (rule.minCount && files.length > 0 && files.length < rule.minCount) {
        return next(
          new AppError(
            ERROR_CODE.PAYLOAD_ERROR,
            {
              [rule.field]: `${rule.field} needs at least ${rule.minCount} file(s)`,
            },
            HTTP_STATUS.BAD_REQUEST
          )
        );
      }

      // max count
      if (rule.maxCount && files.length > rule.maxCount) {
        return next(
          new AppError(
            ERROR_CODE.PAYLOAD_ERROR,
            {
              [rule.field]: `${rule.field} exceeds max count ${rule.maxCount}`,
            },
            HTTP_STATUS.BAD_REQUEST
          )
        );
      }

      const { mimes: allowedMimes, exts: allowedExts } = resolveAllowed(
        rule.allow ?? []
      );

      // kiểm từng file: maxSize + mimes
      for (const file of files) {
        // Check max size
        if (rule.maxSize && file.size > rule.maxSize) {
          return next(
            new AppError(
              ERROR_CODE.PAYLOAD_ERROR,
              {
                [rule.field]: `${rule.field} too large (max ${rule.maxSize} bytes)`,
              },
              HTTP_STATUS.BAD_REQUEST
            )
          );
        }

        // MIME + EXT (đồng thời). Nếu tập trống → không hạn chế theo tiêu chí đó.
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = allowedMimes.size
          ? allowedMimes.has(file.mimetype)
          : true;
        const extOk = allowedExts.size ? allowedExts.has(ext) : true;

        if (!mimeOk || !extOk) {
          return next(
            new AppError(
              ERROR_CODE.PAYLOAD_ERROR,
              {
                [rule.field]: `${rule.field} invalid type (ext=${ext}, mime=${file.mimetype})`,
              },
              HTTP_STATUS.BAD_REQUEST
            )
          );
        }
      }
    }

    next();
  };
}
