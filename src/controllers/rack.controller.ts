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

  const result = await rackService.getAll({
    page,
    limit,
    search,
    zoneCode,
  });

  ApiResponse.paginated(res, result.data, page, limit, result.total);
};

// ==================== GET DETAIL ====================

const getDetail = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as GetRackDetailSchemaParams;

  const result = await rackService.getDetail(code);

  ApiResponse.ok(res, 'OK', result.data);
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
    createdBy: req.user?.userId,
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
    updatedBy: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== DELETE ====================

const remove = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as DeleteRackSchemaParams;

  await rackService.remove({
    code,
    updatedBy: req.user?.userId,
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
