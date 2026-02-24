import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { corsConfig, helmetConfig } from '~/configs';
import { HTTP_STATUS } from '~/constants';
import { AppError } from '~/errors/app-error';
import { errorHandler, httpLogger } from '~/middlewares';

const app: Application = express();

(() => {
  // Thêm các HTTP security headers để giảm rủi ro tấn công web.
  app.use(helmet(helmetConfig));

  // Set CORS response headers.
  app.use(cors(corsConfig));

  // Log requests.
  app.use(httpLogger);

  // Route test
  app.get('/', (req, res) => {
    throw new AppError({
      httpStatusCode: HTTP_STATUS.CONFLICT,
      message: 'Conflict',
      errorCode: 'CONFLICT',
    });
  });

  // Global error handler.
  app.use(errorHandler);
})();

export default app;
