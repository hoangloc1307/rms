import { Router } from 'express';
import { authController } from '~/controllers';
import { authenticate, requestValidator } from '~/middlewares';
import {
  changePasswordSchema,
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
router.post('/logout', authenticate, authController.logout);
router.post('/google', requestValidator(googleLoginSchema), authController.googleLogin);
router.post('/forgot-password', requestValidator(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', requestValidator(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticate, requestValidator(changePasswordSchema), authController.changePassword);

export default router;
