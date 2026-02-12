import chalk from 'chalk';
import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';
import { envSchema } from '~/schemas';

// Kiểm tra NODE_ENV có tồn tại không
const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  console.error(chalk.red('❌ NODE_ENV is not defined.'));
  process.exit(1);
}

// Load đúng file .env theo môi trường
dotenv.config({ path: path.resolve(process.cwd(), `.env.${NODE_ENV}`) });

// Kiểm tra các biến môi trường
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(chalk.red('❌ Invalid environment variables:'));
  const formatted = z.formatError(parsedEnv.error);
  console.error(formatted);
  process.exit(1);
}

export const environmentConfig = parsedEnv.data;
