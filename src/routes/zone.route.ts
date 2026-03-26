import { Router } from 'express';
import { zoneController } from '~/controllers';
import { requestValidator } from '~/middlewares';
import {
  createZoneSchema,
  deleteZoneSchema,
  getZoneDetailSchema,
  listZoneSchema,
  updateZoneSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(listZoneSchema), zoneController.getAll);
router.get('/:code', requestValidator(getZoneDetailSchema), zoneController.getDetail);
router.post('/', requestValidator(createZoneSchema), zoneController.create);
router.put('/:code', requestValidator(updateZoneSchema), zoneController.update);
router.delete('/:code', requestValidator(deleteZoneSchema), zoneController.remove);

export default router;
