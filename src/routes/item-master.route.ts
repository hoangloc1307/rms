import { Router } from 'express';
import { upload } from '~/configs';
import { itemMasterController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { fileValidator } from '~/middlewares/file-validator.middleware';
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
router.post(
  '/import',
  upload('imports').single('itemMasterFile'),
  fileValidator([{ field: 'itemMasterFile', required: true, allow: ['XLSX', 'XLS'] }]),
  itemMasterController.importItemMaster,
);
router.delete('/:itemCode', requestValidator(deleteItemMasterSchema), itemMasterController.deleteItemMaster);
router.put('/:itemCode', requestValidator(updateItemMasterSchema), itemMasterController.updateItemMaster);

export default router;
