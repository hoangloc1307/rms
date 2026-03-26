import { Router } from 'express';
import { shelfController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  createShelfSchema,
  deleteShelfSchema,
  getShelfDetailSchema,
  listShelfSchema,
  updateShelfSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(listShelfSchema), shelfController.getAll);
router.get('/:code', requestValidator(getShelfDetailSchema), shelfController.getDetail);
router.post('/', requestValidator(createShelfSchema), shelfController.create);
router.put('/:code', requestValidator(updateShelfSchema), shelfController.update);
router.delete('/:code', requestValidator(deleteShelfSchema), shelfController.remove);

export default router;
