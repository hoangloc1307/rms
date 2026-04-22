import { Router } from 'express';
import { upload } from '~/configs';
import { importController } from '~/controllers';
import { formValidator } from '~/middlewares/file-validator.middleware';

const router = Router();

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
