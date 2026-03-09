import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { corsConfig, helmetConfig } from '~/configs';
import { authenticate, errorHandler, httpLogger } from '~/middlewares';
import { notFoundHandler } from '~/middlewares/not-found-handler';
import { routesConfig } from '~/routes';

const app: Application = express();

(() => {
  // Thêm các HTTP security headers để giảm rủi ro tấn công web.
  app.use(helmet(helmetConfig));

  // Set CORS response headers.
  app.use(cors(corsConfig));

  // Parse JSON request bodies.
  app.use(express.json());

  // Log requests.
  app.use(httpLogger);

  // Authenticate requests.
  app.use(authenticate);

  // Routes
  routesConfig.forEach(({ path, router }) => {
    app.use(`/api${path}`, router);
  });

  // Not found handler
  app.use(notFoundHandler);

  // Global error handler.
  app.use(errorHandler);
})();

export default app;
