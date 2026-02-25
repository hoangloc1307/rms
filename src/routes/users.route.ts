import { Router } from 'express';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/', (_req, res) => {
  ApiResponse.ok(res, 'Create user');
});

export default router;
