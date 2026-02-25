import { Router } from 'express';
import { ApiResponse } from '~/utils';

const router = Router();

router.post('/login', (_req, res) => {
  ApiResponse.ok(res, 'Login');
});

export default router;
