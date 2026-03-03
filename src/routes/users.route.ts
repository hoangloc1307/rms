import { Router } from 'express';
import { authenticate } from '~/middlewares';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/', authenticate, (_req, res) => {
  ApiResponse.ok(res, 'Create user');
});

export default router;
