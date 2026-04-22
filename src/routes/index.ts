import { type Router } from 'express';
import authRoutes from '~/routes/auth.route';
import healthRoutes from '~/routes/health.route';
import importRoutes from '~/routes/import.route';
import inventoryRoutes from '~/routes/inventory.route';
import itemMasterRoutes from '~/routes/item.route';
import meRoutes from '~/routes/me.route';
import notificationRoutes from '~/routes/notification.route';
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
  { path: '/auth', router: authRoutes, isPublic: true },
  { path: '/health', router: healthRoutes, isPublic: true },
  { path: '/import', router: importRoutes },
  { path: '/inventory', router: inventoryRoutes },
  { path: '/items', router: itemMasterRoutes },
  { path: '/me', router: meRoutes },
  { path: '/notifications', router: notificationRoutes },
  { path: '/racks', router: rackRoutes },
  { path: '/shelves', router: shelfRoutes },
  { path: '/upload', router: uploadRoutes },
  { path: '/warehouses', router: warehouseRoutes },
  { path: '/zones', router: zoneRoutes },
];
