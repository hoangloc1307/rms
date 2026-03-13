import { Router } from 'express';
import { addSendMailJob } from '~/helpers';
import { authorize } from '~/middlewares';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/', authorize('REQUEST', 'CREATE'), async (_req, res) => {
  await addSendMailJob({
    to: 'tran.nguyen.hoang.loc@vnn.nokgrp.com',
    subject: 'Test',
    text: 'test',
  });
  ApiResponse.ok(res, 'Create users');
});

export default router;
