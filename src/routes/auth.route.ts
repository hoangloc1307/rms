import { Router } from 'express';
import { authController } from '~/controllers';
import { payloadValidator } from '~/middlewares';
import { googleLoginSchema, loginSchema, registerSchema } from '~/validations';

const router = Router();

router.post('/register', payloadValidator(registerSchema), authController.register);
router.post('/login', payloadValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/google', payloadValidator(googleLoginSchema), authController.googleLogin);

export default router;
