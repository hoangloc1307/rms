import SwaggerParser from '@apidevtools/swagger-parser';
import { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from '~/configs';

export function setupSwagger(app: Application) {
  if (env.ENVIRONMENT === 'production') return;

  app.use('/api-docs', swaggerUi.serve);

  app.get('/api-docs', async (req, res, next) => {
    const filePath = path.join(process.cwd(), 'src/docs/swagger.yaml');
    const swaggerDocument = await SwaggerParser.bundle(filePath);

    return swaggerUi.setup(swaggerDocument)(req, res, next);
  });
}
