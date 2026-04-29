import { Router } from 'express';
import { zoneController } from '~/controllers';
import { authorize, requestValidator } from '~/middlewares';
import {
  createZoneSchema,
  deleteZoneSchema,
  getZoneDetailSchema,
  paginationSchema,
  updateZoneSchema,
} from '~/validations';

const router = Router();

router.get('/', requestValidator(paginationSchema), authorize('ZONES', ['READ', 'MANAGE']), zoneController.getAll);
router.get(
  '/:code',
  requestValidator(getZoneDetailSchema),
  authorize('ZONES', ['READ', 'MANAGE']),
  zoneController.getDetail,
);
router.post('/', requestValidator(createZoneSchema), authorize('ZONES', ['CREATE', 'MANAGE']), zoneController.create);
router.put(
  '/:code',
  requestValidator(updateZoneSchema),
  authorize('ZONES', ['UPDATE', 'MANAGE']),
  zoneController.update,
);
router.delete(
  '/:code',
  requestValidator(deleteZoneSchema),
  authorize('ZONES', ['DELETE', 'MANAGE']),
  zoneController.remove,
);

export default router;
