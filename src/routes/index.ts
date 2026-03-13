import { type Router } from 'express';
import authRoutes from '~/routes/auth.route';
import healthRoutes from '~/routes/health.route';
import uploadRoutes from '~/routes/upload.route';
import userRoutes from '~/routes/users.route';

interface RoutesConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const routesConfig: RoutesConfig[] = [
  { path: '/health', router: healthRoutes, isPublic: true },
  { path: '/auth', router: authRoutes, isPublic: true },
  { path: '/users', router: userRoutes },
  { path: '/upload', router: uploadRoutes },
];
