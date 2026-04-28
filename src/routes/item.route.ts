import { Router } from 'express';
import { itemMasterController } from '~/controllers';
import { authorize, requestValidator } from '~/middlewares';
import {
  createItemMasterSchema,
  deleteItemMasterSchema,
  getItemMasterDetailSchema,
  paginationSchema,
  updateItemMasterSchema,
} from '~/validations';

const router = Router();

router.get(
  '/',
  requestValidator(paginationSchema),
  authorize('ITEMS', ['READ', 'MANAGE']),
  itemMasterController.getAll,
);
router.get(
  '/:itemCode',
  requestValidator(getItemMasterDetailSchema),
  authorize('ITEMS', ['READ', 'MANAGE']),
  itemMasterController.getItemMasterDetail,
);
router.post(
  '/',
  requestValidator(createItemMasterSchema),
  authorize('ITEMS', ['CREATE', 'MANAGE']),
  itemMasterController.createItemMaster,
);
router.delete(
  '/:itemCode',
  requestValidator(deleteItemMasterSchema),
  authorize('ITEMS', ['DELETE', 'MANAGE']),
  itemMasterController.deleteItemMaster,
);
router.put(
  '/:itemCode',
  requestValidator(updateItemMasterSchema),
  authorize('ITEMS', ['UPDATE', 'MANAGE']),
  itemMasterController.updateItemMaster,
);

export default router;
