import { Router } from 'express';
import { upload } from '~/configs';
import { importController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { formValidator } from '~/middlewares/file-validator.middleware';
import { getImportByCodeSchema } from '~/validations';

const router = Router();
router.get('/:code', requestValidator(getImportByCodeSchema), importController.getImportByCode);
router.post(
  '/',
  upload('imports').single('importFile'),
  formValidator([
    { field: 'importFile', type: 'file', required: true, allow: ['XLSX', 'XLS'] },
    { field: 'type', type: 'text', required: true },
  ]),
  importController.importUpload,
);

export default router;
