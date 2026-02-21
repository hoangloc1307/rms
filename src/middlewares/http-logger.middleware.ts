import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import pinoHttp from 'pino-http';
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

  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  customSuccessMessage: function (req, _res) {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage: function (req, _res, _err) {
    return `${req.method} ${req.url} failed`;
  },

  customProps: function (req, res) {
    return {
      responseTime: res.getHeader('X-Response-Time'),
      userId: (req as RequestWithUser).user?.id,
    };
  },
});
