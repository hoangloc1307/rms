import { Router } from 'express';
import { warehouseController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  createWarehouseSchema,
  deleteWarehouseSchema,
  getWarehouseDetailSchema,
  listWarehouseSchema,
  updateWarehouseSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(listWarehouseSchema), warehouseController.getAll);
router.get('/:code', requestValidator(getWarehouseDetailSchema), warehouseController.getDetail);
router.post('/', requestValidator(createWarehouseSchema), warehouseController.create);
router.put('/:code', requestValidator(updateWarehouseSchema), warehouseController.update);
router.delete('/:code', requestValidator(deleteWarehouseSchema), warehouseController.remove);

export default router;
