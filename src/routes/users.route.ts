import { Router } from 'express';
import { addJob } from '~/helpers';
import { authorize } from '~/middlewares';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/', authorize('REQUEST', 'CREATE'), async (_req, res) => {
  await addJob('sendEmail', {
    to: 'tran.nguyen.hoang.loc@vnn.nokgrp.com',
    subject: 'Test',
    text: 'test',
  });
  ApiResponse.ok(res, 'Create users');
});

export default router;
