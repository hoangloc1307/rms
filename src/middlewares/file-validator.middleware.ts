import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { FILE_EXTENSION } from '~/constants';
import { AppError } from '~/errors';
import { getFilesFromReq, resolveAllowed } from '~/utils';

interface FileRule {
  field: string;
  required?: boolean;
  allow?: FILE_EXTENSION[];
  maxSize?: number;
  minCount?: number;
  maxCount?: number;
}

export const fileValidator = (rules: FileRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: Record<string, Express.Multer.File[]> = {};

    for (const rule of rules) {
      const ruleFiles = getFilesFromReq(req, rule.field);

      if (rule.required && ruleFiles.length === 0) {
        return next(AppError.badRequest(`${rule.field} is required`));
      }

      if (rule.minCount && ruleFiles.length > 0 && ruleFiles.length < rule.minCount) {
        return next(AppError.badRequest(`${rule.field} needs at least ${rule.minCount} file(s)`));
      }

      if (rule.maxCount && ruleFiles.length > rule.maxCount) {
        return next(AppError.badRequest(`${rule.field} exceeds max count ${rule.maxCount}`));
      }

      const { mimes: allowedMimes, exts: allowedExts } = resolveAllowed(rule.allow ?? []);

      for (const file of ruleFiles) {
        if (rule.maxSize && file.size > rule.maxSize) {
          return next(AppError.contentTooLarge(`${rule.field} too large (max ${rule.maxSize} bytes)`));
        }

        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = allowedMimes.size ? allowedMimes.has(file.mimetype) : true;
        const extOk = allowedExts.size ? allowedExts.has(ext) : true;

        if (!mimeOk || !extOk) {
          return next(AppError.badRequest(`${rule.field} invalid type (ext=${ext}, mime=${file.mimetype})`));
        }
      }

      files[rule.field] = ruleFiles;
    }

    req.validatedData = { ...(req.validatedData ?? {}), files };

    next();
  };
};
