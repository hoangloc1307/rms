import z from 'zod';

export const envSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'production'], { error: 'Invalid environment.' }),
  PORT: z.coerce
    .number({ error: 'PORT must be a number.' })
    .int({ error: 'PORT must be an integer.' })
    .min(1, { error: 'PORT must be greater than 0.' })
    .max(65535, { error: 'PORT must be less than 65536.' }),
  BASE_URL: z.url({ error: 'BASE_URL must be a valid URL.' }).transform((url) => url.replace(/\/$/, '')),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'], { error: 'Invalid log level.' }),
  VERSION: z.string({ error: 'VERSION must be a string.' }).regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, {
    message: 'VERSION must be valid semver (e.g. 1.0.0)',
  }),
});
