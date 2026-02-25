import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { corsConfig, helmetConfig } from '~/configs';
import { HTTP_STATUS } from '~/constants';
import { AppError } from '~/errors/app-error';
import { errorHandler, httpLogger } from '~/middlewares';
import { notFoundHandler } from '~/middlewares/not-found-handler';
import { ApiResponse } from '~/utils';

const app: Application = express();

(() => {
  // Thêm các HTTP security headers để giảm rủi ro tấn công web.
  app.use(helmet(helmetConfig));

  // Set CORS response headers.
  app.use(cors(corsConfig));

  // Log requests.
  app.use(httpLogger);

  // Route test
  app.get('/', () => {
    throw new AppError({
      httpStatusCode: HTTP_STATUS.CONFLICT,
      message: 'Conflict',
      errorCode: 'CONFLICT',
    });
  });

  app.get('/ok', (req, res) => {
    ApiResponse.ok(res);
  });

  app.get('/paginated', (req, res) => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    ApiResponse.paginated(res, data, 1, 10, 89);
  });

  // Not found handler
  app.use(notFoundHandler);

  // Global error handler.
  app.use(errorHandler);
})();

export default app;
