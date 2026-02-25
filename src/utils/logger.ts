import pino, { LoggerOptions } from 'pino';
import { env } from '~/configs';

const accessStream = pino.destination({
  dest: './logs/access.log',
  mkdir: true,
  sync: false,
});

const errorStream = pino.destination({
  dest: './logs/error.log',
  mkdir: true,
  sync: false,
});

const isProduction = env.ENVIRONMENT === 'production';

const pinoOptions: LoggerOptions = {
  level: env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.refreshToken'],
    remove: true,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
};

export const logger = !isProduction
  ? pino(
      pinoOptions,
      pino.multistream(
        [
          { level: 'info', stream: accessStream },
          { level: 'error', stream: errorStream },
        ],
        {
          dedupe: true,
        },
      ),
    )
  : pino({
      ...pinoOptions,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          levelFirst: true,
        },
      },
    });
