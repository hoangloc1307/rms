import pino from 'pino';
import { environmentConfig } from '~/configs';

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

const isProduction = environmentConfig.ENVIRONMENT === 'production';

export const logger = isProduction
  ? pino(
      {
        level: environmentConfig.LOG_LEVEL,
        timestamp: pino.stdTimeFunctions.isoTime,
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.refreshToken'],
          remove: true,
        },
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
      pino.multistream([{ stream: accessStream }, { level: 'error', stream: errorStream }]),
    )
  : pino({
      level: environmentConfig.LOG_LEVEL,
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.refreshToken'],
        remove: true,
      },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          levelFirst: true,
        },
      },
      formatters: {
        level: (label) => ({ level: label }),
      },
    });
