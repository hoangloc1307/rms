import { Router } from 'express';
import { uploadController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { getUploadUrlSchema } from '~/validations';

const router = Router();

router.post('/upload-url', requestValidator(getUploadUrlSchema), uploadController.getUploadUrl);

export default router;
