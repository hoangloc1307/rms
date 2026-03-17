import { Router } from 'express';
import { itemMasterController } from '~/controllers';
import { authorize, payloadValidator } from '~/middlewares';
import { paginationSchema } from '~/validations';

const router = Router();

router.get('/', authorize('ITEM_MASTER', 'READ'), payloadValidator(paginationSchema), itemMasterController.getAll);

export default router;
