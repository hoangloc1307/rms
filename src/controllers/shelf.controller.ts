import { Request, Response } from 'express';
import { shelfService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  CreateShelfSchemaBody,
  DeleteShelfSchemaParams,
  GetShelfDetailSchemaParams,
  ListShelfSchemaQuery,
  UpdateShelfSchemaBody,
  UpdateShelfSchemaParams,
} from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search, rackCode } = req.validatedData?.query as ListShelfSchemaQuery;

  const result = await shelfService.getAll({
    page,
    limit,
    search,
    rackCode,
  });

  ApiResponse.paginated(res, result.data, page, limit, result.total);
};

// ==================== GET DETAIL ====================

const getDetail = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as GetShelfDetailSchemaParams;

  const result = await shelfService.getDetail(code);

  ApiResponse.ok(res, 'OK', result.data);
};

// ==================== CREATE ====================

const create = async (req: Request, res: Response) => {
  const { code, rackCode, name, note, level } = req.validatedData?.body as CreateShelfSchemaBody;

  const result = await shelfService.create({
    data: {
      code,
      rackCode,
      name,
      note,
      level,
    },
    createdBy: req.user?.userId,
  });

  ApiResponse.created(res, 'OK', result);
};

// ==================== UPDATE ====================

const update = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as UpdateShelfSchemaParams;
  const { rackCode, name, note, level } = req.validatedData?.body as UpdateShelfSchemaBody;

  const result = await shelfService.update({
    code,
    data: {
      rackCode,
      name,
      note,
      level,
    },
    updatedBy: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== DELETE ====================

const remove = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as DeleteShelfSchemaParams;

  await shelfService.remove({
    code,
    updatedBy: req.user?.userId,
  });

  ApiResponse.deleted(res);
};

// ==================== EXPORT ====================

export const shelfController = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
