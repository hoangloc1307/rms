import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { compressConfig, corsConfig, envConfig, jsonConfig } from './config';
import { loadSwagger } from './docs/swagger';
import { ENVIROMENTS } from './enums';
import errorHandler from './middlewares/errorHandler';
import { multerErrorHandler } from './middlewares/upload';
import { routesConfig } from './routes';

const app: Application = express();

(async () => {
  // Middlewares
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(express.json(jsonConfig));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(compression(compressConfig));

  // Swagger
  const swaggerDocument = await loadSwagger();
  if (envConfig.ENV === ENVIROMENTS.DEVELOPMENT) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  // Routes
  routesConfig.forEach(({ path, router }) => {
    app.use(`/api/${path}`, router);
  });

  // Error middlewares
  app.use(multerErrorHandler);
  app.use(errorHandler);
})();

export default app;
