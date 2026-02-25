import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { LevelWithSilent } from 'pino';
import pinoHttp from 'pino-http';
import type { SerializedRequest, SerializedResponse } from 'pino-std-serializers';
import { logger } from '~/utils';

interface RequestWithUser extends IncomingMessage {
  user?: { id: string | number };
}

export const httpLogger = pinoHttp({
  logger: logger,

  genReqId: (req, res) => {
    const existingId = req.id ?? req.headers['x-request-id'];
    if (existingId) return existingId;
    const id = randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },

  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.token'],
    remove: true,
  },

  customLogLevel: (_req, res, _err): LevelWithSilent => {
    if (res.statusCode >= 500) return 'silent';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // customSuccessMessage: function (req, _res) {
  //   return `${req.method} ${req.url} completed`;
  // },

  // customErrorMessage: function (req, _res, _err) {
  //   return `${req.method} ${req.url} failed`;
  // },

  customProps: (req, _res) => {
    return {
      userId: (req as RequestWithUser).user?.id,
    };
  },

  customErrorObject: () => ({}),

  serializers: {
    req: (req: SerializedRequest) => ({
      method: req.method,
      url: req.url,
      requestId: req.id,
    }),
    res: (res: SerializedResponse) => ({
      httpStatus: res.statusCode,
    }),
  },
});
