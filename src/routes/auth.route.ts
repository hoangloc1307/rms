import authController from '../controllers/auth.controller';
import payloadValidator from '../middlewares/payloadValidator';
import { safeRouter } from '../utils/safeRouter';
import authValidator from '../validators/authValidator';

const authRouter = safeRouter();

authRouter.post(
  '/login',
  authValidator.login,
  payloadValidator,
  authController.login
);

export default authRouter;
