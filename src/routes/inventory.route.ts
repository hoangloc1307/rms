import { Router } from 'express';
import { inventoryController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import { checkLabelExistsSchema } from '~/validations';

const router = Router();

router.post('/check-label/:labelId', requestValidator(checkLabelExistsSchema), inventoryController.checkLabelExists);

export default router;
