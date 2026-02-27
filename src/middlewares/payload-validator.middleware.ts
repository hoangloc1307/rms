import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import { AppError } from '~/errors/app-error';

export const payloadValidator = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const metadata = result.error.issues.reduce(
      (acc, issue) => {
        acc[issue.path.join('.')] = issue.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    next(AppError.badRequest('Validation Error', metadata));
  }

  req.body = result.data;
  next();
};
