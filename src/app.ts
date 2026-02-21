// import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { helmetConfig } from '~/config';

const app: Application = express();

(() => {
  // <------------------------------------ Middlewares ------------------------------------>
  // Thêm các HTTP security headers để giảm rủi ro tấn công web.
  app.use(helmet(helmetConfig));

  // Set CORS response headers.
  // app.use(cors(corsConfig));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
})();

export default app;
