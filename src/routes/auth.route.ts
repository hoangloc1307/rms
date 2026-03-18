import { Router } from 'express';
import { authController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '~/validations';

const router = Router();

router.post('/register', requestValidator(registerSchema), authController.register);
router.post('/login', requestValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/google', requestValidator(googleLoginSchema), authController.googleLogin);
router.post('/forgot-password', requestValidator(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', requestValidator(resetPasswordSchema), authController.resetPassword);

export default router;
