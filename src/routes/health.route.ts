import { Router } from 'express';
import { healthController } from '~/controllers';

const router = Router();

router.get('/detail', healthController.checkDetail);
router.get('/live', healthController.checkLive);
router.get('/ready', healthController.checkReady);

export default router;
