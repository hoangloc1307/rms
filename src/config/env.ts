import dotenv from 'dotenv';
import path from 'path';
import { ENVIROMENTS } from '../enums';

// Load đúng file .env theo môi trường
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

export const envConfig = {
  ENV: process.env.NODE_ENV || ENVIROMENTS.DEVELOPMENT,
  PORT: process.env.PORT || '3000',
  BASE_URL: process.env.BASE_URL || `http://localhost`,
  DATABASE_URL: process.env.DATABASE_URL,
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || `uploads`,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_ACCESS_EXPIRES: Number(process.env.JWT_ACCESS_EXPIRES) || 15 * 60, // 15m
  JWT_REFRESH_EXPIRES:
    Number(process.env.JWT_REFRESH_EXPIRES) || 7 * 24 * 60 * 60, // 7d
};
