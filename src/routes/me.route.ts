import { Router } from 'express';
import { meController } from '~/controllers';

const router = Router();

router.get('/', meController.getMe);

export default router;
