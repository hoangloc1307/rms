import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message = 'Success') => {
  res.json({ message, data });
};

export const sendError = <T>(
  res: Response,
  status: number,
  code: string,
  message: string,
  errors?: T
) => {
  res.status(status).json({ code, message, errors });
};
