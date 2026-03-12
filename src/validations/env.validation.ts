import ms, { StringValue } from 'ms';
import z from 'zod';

export const envSchema = z.object({
  // App
  ENVIRONMENT: z.enum(['development', 'production'], { error: 'Invalid environment.' }),
  PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),
  BASE_URL: z.url({ error: 'Must be a valid URL.' }).transform((url) => url.replace(/\/$/, '')),
  VERSION: z.string({ error: 'Must be a string.' }).regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, {
    error: 'Must be valid semver (e.g. 1.0.0)',
  }),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'], { error: 'Invalid log level.' }),

  // JWT
  JWT_ACCESS_SECRET: z
    .string({
      error: 'Must be a string',
    })
    .regex(/^[0-9a-fA-F]{128}$/, {
      error: 'Must be 64 bytes hex (128 hex characters)',
    }),
  JWT_REFRESH_SECRET: z
    .string({
      error: 'Must be a string',
    })
    .regex(/^[0-9a-fA-F]{128}$/, {
      error: 'Must be 64 bytes hex (128 hex characters)',
    }),
  JWT_ACCESS_TOKEN_EXPIRY: z.custom<StringValue | number>(
    (val) => {
      if (typeof val === 'number') {
        return val > 0;
      }
      if (typeof val === 'string') {
        const parsed = ms(val as StringValue);
        return typeof parsed === 'number' && parsed > 0;
      }
      return false;
    },
    {
      message: 'Must be a positive number (ms) or valid positive time string (e.g. 15m, 7d, 1h)',
    },
  ),
  JWT_REFRESH_TOKEN_EXPIRY: z.custom<StringValue | number>(
    (val) => {
      if (typeof val === 'number') {
        return val > 0;
      }
      if (typeof val === 'string') {
        const parsed = ms(val as StringValue);
        return typeof parsed === 'number' && parsed > 0;
      }
      return false;
    },
    {
      message: 'Must be a positive number (ms) or valid positive time string (e.g. 15m, 7d, 1h)',
    },
  ),

  // DATABASE
  DATABASE_URL: z.url({ error: 'Must be a valid URL.' }),

  // SMTP
  SMTP_HOST: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),
  SMTP_PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),
  SMTP_USER: z.string({ error: 'Must be a string.' }).optional(),
  SMTP_PASS: z.string({ error: 'Must be a string.' }).optional(),
  EMAIL_FROM: z.email({ error: 'Must be a valid email.' }),

  // GOOGLE OAUTH
  GOOGLE_CLIENT_ID: z.string({ error: 'Must be a string.' }),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),
  AWS_SECRET_ACCESS_KEY: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),
  AWS_REGION: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),
  AWS_S3_BUCKET: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),

  // REDIS
  REDIS_HOST: z.string({ error: 'Must be a string.' }).min(1, { error: 'Must not be empty.' }),
  REDIS_PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),
});
