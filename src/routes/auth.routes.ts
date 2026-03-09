import { Router } from 'express';
import { authController } from '~/controllers';
import { payloadValidator } from '~/middlewares';
import { loginSchema } from '~/validations';

const router = Router();

router.post('/login', payloadValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
