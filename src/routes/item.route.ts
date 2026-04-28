import { Router } from 'express';
import { itemMasterController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  createItemMasterSchema,
  deleteItemMasterSchema,
  getItemMasterDetailSchema,
  paginationSchema,
  updateItemMasterSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(paginationSchema), itemMasterController.getAll);
router.get('/:itemCode', requestValidator(getItemMasterDetailSchema), itemMasterController.getItemMasterDetail);
router.post('/', requestValidator(createItemMasterSchema), itemMasterController.createItemMaster);
router.delete('/:itemCode', requestValidator(deleteItemMasterSchema), itemMasterController.deleteItemMaster);
router.put('/:itemCode', requestValidator(updateItemMasterSchema), itemMasterController.updateItemMaster);

export default router;
