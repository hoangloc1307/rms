import { type Router } from 'express';
import authRoutes from '~/routes/auth.routes';
import healthRoutes from '~/routes/health.routes';
import userRoutes from '~/routes/users.route';

interface RoutesConfig {
  path: string;
  router: Router;
}

export const routesConfig: RoutesConfig[] = [
  { path: 'health', router: healthRoutes },
  { path: 'auth', router: authRoutes },
  { path: 'users', router: userRoutes },
];
