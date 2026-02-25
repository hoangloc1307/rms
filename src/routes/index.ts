import { type Router } from 'express';
import authRoutes from '~/routes/auth.routes';
import userRoutes from '~/routes/users.route';

interface RoutesConfig {
  path: string;
  router: Router;
}

export const routesConfig: RoutesConfig[] = [
  { path: 'auth', router: authRoutes },
  { path: 'users', router: userRoutes },
];
