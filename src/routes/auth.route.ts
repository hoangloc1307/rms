import { Router } from 'express';
import { authController } from '~/controllers';
import { payloadValidator } from '~/middlewares';
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '~/validations';

const router = Router();

router.post('/register', payloadValidator(registerSchema), authController.register);
router.post('/login', payloadValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/google', payloadValidator(googleLoginSchema), authController.googleLogin);
router.post('/forgot-password', payloadValidator(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', payloadValidator(resetPasswordSchema), authController.resetPassword);

export default router;
