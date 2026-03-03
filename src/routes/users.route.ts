import { Router } from 'express';
import { authenticate } from '~/middlewares';
import { ApiResponse, sendEmail } from '~/utils';

const router = Router();

router.post('/', authenticate, async (_req, res) => {
  await sendEmail({
    subject: 'test gửi mail',
    data: {},
    email: 'recipient@example.com',
    html: 'This is a test email.',
  });
  ApiResponse.ok(res, 'Create user');
});

export default router;
