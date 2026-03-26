import { Request, Response } from 'express';
import { warehouseService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  CreateWarehouseSchemaBody,
  DeleteWarehouseSchemaParams,
  GetWarehouseDetailSchemaParams,
  ListWarehouseSchemaQuery,
  UpdateWarehouseSchemaBody,
  UpdateWarehouseSchemaParams,
} from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search } = req.validatedData?.query as ListWarehouseSchemaQuery;

  const result = await warehouseService.getAll({
    page,
    limit,
    search,
  });

  ApiResponse.paginated(res, result.data, page, limit, result.total);
};

// ==================== GET DETAIL ====================

const getDetail = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as GetWarehouseDetailSchemaParams;

  const result = await warehouseService.getDetail(code);

  ApiResponse.ok(res, 'OK', result.data);
};

// ==================== CREATE ====================

const create = async (req: Request, res: Response) => {
  const { code, name, note } = req.validatedData?.body as CreateWarehouseSchemaBody;

  const result = await warehouseService.create({
    data: {
      code,
      name,
      note,
    },
    createdBy: req.user?.userId,
  });

  ApiResponse.created(res, 'OK', result);
};

// ==================== UPDATE ====================

const update = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as UpdateWarehouseSchemaParams;
  const { name, note } = req.validatedData?.body as UpdateWarehouseSchemaBody;

  const result = await warehouseService.update({
    code,
    data: {
      name,
      note,
    },
    updatedBy: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== DELETE ====================

const remove = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as DeleteWarehouseSchemaParams;

  await warehouseService.remove({
    code,
    updatedBy: req.user?.userId,
  });

  ApiResponse.deleted(res);
};

// ==================== EXPORT ====================

export const warehouseController = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
