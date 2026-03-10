import { Router } from 'express';
import { uploadController } from '~/controllers';
import { payloadValidator } from '~/middlewares';
import { getUploadUrlSchema } from '~/validations';

const router = Router();

router.post('/upload-url', payloadValidator(getUploadUrlSchema), uploadController.getUploadUrl);

export default router;
