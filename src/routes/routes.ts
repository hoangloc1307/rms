import { Router } from 'express';
import authRouter from './auth.route';

interface RouteConfig {
  path: string;
  router: Router;
}

export const routesConfig: RouteConfig[] = [
  { path: 'auth', router: authRouter },
];
