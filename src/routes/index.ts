import { type Router } from 'express';
import authRoutes from '~/routes/auth.route';
import healthRoutes from '~/routes/health.route';
import itemMasterRoutes from '~/routes/item-master.route';
import uploadRoutes from '~/routes/upload.route';

interface RoutesConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const routesConfig: RoutesConfig[] = [
  { path: '/health', router: healthRoutes, isPublic: true },
  { path: '/auth', router: authRoutes, isPublic: true },
  { path: '/upload', router: uploadRoutes },
  { path: '/item-master', router: itemMasterRoutes },
];
