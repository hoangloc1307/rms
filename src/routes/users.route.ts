import { Response, Router } from 'express';
import z from 'zod';
import { requestValidator } from '~/middlewares';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';

const router = Router();

router.post(
  '/',
  requestValidator(
    z.object({
      query: z.object({
        name: z.string().min(1, 'Name is required').trim(),
      }),
      body: z.object({
        lastName: z.string().min(1, 'Last name is required'),
      }),
    }),
  ),
  (req: TypedRequest<{ lastName: string }, object, { name: string }>, res: Response) => {
    const { name } = req.query;
    const { lastName } = req.body;
    ApiResponse.ok(res, `Test create user 4 ${name} ${lastName}`);
  },
);

export default router;
