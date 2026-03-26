import { Router } from 'express';
import { rackController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  createRackSchema,
  deleteRackSchema,
  getRackDetailSchema,
  listRackSchema,
  updateRackSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(listRackSchema), rackController.getAll);
router.get('/:code', requestValidator(getRackDetailSchema), rackController.getDetail);
router.post('/', requestValidator(createRackSchema), rackController.create);
router.put('/:code', requestValidator(updateRackSchema), rackController.update);
router.delete('/:code', requestValidator(deleteRackSchema), rackController.remove);

export default router;
