import { Router } from 'express';
import { notificationController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { getNotificationSchema, markAsReadSchema } from '~/validations';

const router = Router();

router.get('/', requestValidator(getNotificationSchema), notificationController.getAll);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', requestValidator(markAsReadSchema), notificationController.markAsRead);

export default router;
