// import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
// import { corsConfig } from '~/config/cors.config';

const app: Application = express();

(async () => {
  // <------------------------------------ Middlewares ------------------------------------>
  // Thêm các HTTP security headers để giảm rủi ro tấn công web.
  app.use(helmet());

  // Set CORS response headers.
  // app.use(cors(corsConfig));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
})();

export default app;
