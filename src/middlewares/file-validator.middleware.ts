import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { FILE_EXTENSION } from '~/constants';
import { AppError } from '~/errors';
import { getFilesFromReq, resolveAllowed } from '~/utils';

type FormFieldType = 'file' | 'text';

interface FormFieldRule {
  field: string;
  type: FormFieldType;
  required?: boolean;
  allow?: FILE_EXTENSION[];
  maxSize?: number;
  minCount?: number;
  maxCount?: number;
}

export const formValidator = (rules: FormFieldRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: Record<string, Express.Multer.File[]> = {};
    const bodies: Record<string, string> = {};

    for (const rule of rules) {
      if (rule.type === 'file') {
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

      if (rule.type === 'text') {
        const ruleText = (req.body as Record<string, string>)[rule.field];
        if (rule.required && !ruleText) {
          return next(AppError.badRequest(`${rule.field} is required`));
        }
        bodies[rule.field] = ruleText;
      }
    }

    req.validatedData = { ...(req.validatedData ?? {}), files, body: bodies };

    next();
  };
};
