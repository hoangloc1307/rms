import { type Router } from 'express';
import authRoutes from '~/routes/auth.route';
import healthRoutes from '~/routes/health.route';
import inventoryRoutes from '~/routes/inventory.route';
import itemMasterRoutes from '~/routes/item.route';
import rackRoutes from '~/routes/rack.route';
import shelfRoutes from '~/routes/shelf.route';
import uploadRoutes from '~/routes/upload.route';
import warehouseRoutes from '~/routes/warehouse.route';
import zoneRoutes from '~/routes/zone.route';

interface RoutesConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const routesConfig: RoutesConfig[] = [
  { path: '/health', router: healthRoutes, isPublic: true },
  { path: '/auth', router: authRoutes, isPublic: true },
  { path: '/upload', router: uploadRoutes },
  { path: '/items', router: itemMasterRoutes },
  { path: '/warehouses', router: warehouseRoutes },
  { path: '/zones', router: zoneRoutes },
  { path: '/racks', router: rackRoutes },
  { path: '/shelves', router: shelfRoutes },
  { path: '/inventory', router: inventoryRoutes },
];
