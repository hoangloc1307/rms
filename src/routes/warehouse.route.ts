import { Router } from 'express';
import { warehouseController } from '~/controllers';
import { authorize, requestValidator } from '~/middlewares';
import {
  createWarehouseSchema,
  deleteWarehouseSchema,
  getWarehouseDetailSchema,
  paginationSchema,
  updateWarehouseSchema,
} from '~/validations';

const router = Router();

router.get(
  '/',
  requestValidator(paginationSchema),
  authorize('WAREHOUSES', ['READ', 'MANAGE']),
  warehouseController.getAll,
);
router.get(
  '/:code',
  requestValidator(getWarehouseDetailSchema),
  authorize('WAREHOUSES', ['READ', 'MANAGE']),
  warehouseController.getDetail,
);
router.post(
  '/',
  requestValidator(createWarehouseSchema),
  authorize('WAREHOUSES', ['CREATE', 'MANAGE']),
  warehouseController.create,
);
router.put(
  '/:code',
  requestValidator(updateWarehouseSchema),
  authorize('WAREHOUSES', ['UPDATE', 'MANAGE']),
  warehouseController.update,
);
router.delete(
  '/:code',
  requestValidator(deleteWarehouseSchema),
  authorize('WAREHOUSES', ['DELETE', 'MANAGE']),
  warehouseController.remove,
);

export default router;
