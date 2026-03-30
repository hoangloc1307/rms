import { Request, Response } from 'express';
import { rackService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  CreateRackSchemaBody,
  DeleteRackSchemaParams,
  GetRackDetailSchemaParams,
  ListRackSchemaQuery,
  UpdateRackSchemaBody,
  UpdateRackSchemaParams,
} from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search, zoneCode } = req.validatedData?.query as ListRackSchemaQuery;

  const { data, total } = await rackService.getAll({
    page,
    limit,
    search,
    zoneCode,
  });

  ApiResponse.paginated(res, data, page, limit, total);
};

// ==================== GET DETAIL ====================

const getDetail = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as GetRackDetailSchemaParams;

  const { data } = await rackService.getDetail(code);

  ApiResponse.ok(res, 'OK', data);
};

// ==================== CREATE ====================

const create = async (req: Request, res: Response) => {
  const { code, zoneCode, name, note } = req.validatedData?.body as CreateRackSchemaBody;

  const result = await rackService.create({
    data: {
      code,
      zoneCode,
      name,
      note,
    },
    userId: req.user?.userId,
  });

  ApiResponse.created(res, 'OK', result);
};

// ==================== UPDATE ====================

const update = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as UpdateRackSchemaParams;
  const { zoneCode, name, note } = req.validatedData?.body as UpdateRackSchemaBody;

  const result = await rackService.update({
    code,
    data: {
      zoneCode,
      name,
      note,
    },
    userId: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== DELETE ====================

const remove = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as DeleteRackSchemaParams;

  await rackService.remove({
    code,
    userId: req.user?.userId,
  });

  ApiResponse.deleted(res);
};

// ==================== EXPORT ====================

export const rackController = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
