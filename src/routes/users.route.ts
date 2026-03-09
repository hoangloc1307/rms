import { Router } from 'express';
import { authorize } from '~/middlewares';
import { ApiResponse, renderTemplate, sendEmail } from '~/utils';

const router = Router();

router.post('/', authorize('REQUEST', 'CREATE'), async (_req, res) => {
  const html = renderTemplate('request-created', {
    name: 'John Doe',
    requestId: '1234567890',
    status: 'Pending',
  });

  await sendEmail({
    subject: 'Test send mail',
    to: ['test.to1@gmail.com', 'test.to2@gmail.com'],
    html,
  });
  ApiResponse.ok(res, 'Create user');
});

export default router;
