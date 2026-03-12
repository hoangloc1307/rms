import { Router } from 'express';
import { authorize } from '~/middlewares';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/', authorize('REQUEST', 'CREATE'), (_req, res) => {
  ApiResponse.ok(res, 'Create user');
});

export default router;
