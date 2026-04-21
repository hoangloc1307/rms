import { Router } from 'express';
import { notificationController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { getNotificationSchema } from '~/validations';

const router = Router();

router.get('/', requestValidator(getNotificationSchema), notificationController.getAll);
router.get('/unread-count', notificationController.getUnreadCount);

export default router;
