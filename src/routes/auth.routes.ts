import { Router } from 'express';
import { authController } from '~/controllers';
import { payloadValidator } from '~/middlewares';
import { loginSchema } from '~/validations';

const router = Router();

router.post('/login', payloadValidator(loginSchema), authController.login);

export default router;
