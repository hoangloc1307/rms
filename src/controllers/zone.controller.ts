import { Request, Response } from 'express';
import { zoneService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  CreateZoneSchemaBody,
  DeleteZoneSchemaParams,
  GetZoneDetailSchemaParams,
  ListZoneSchemaQuery,
  UpdateZoneSchemaBody,
  UpdateZoneSchemaParams,
} from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search, warehouseCode } = req.validatedData?.query as ListZoneSchemaQuery;

  const { data, total } = await zoneService.getAll({
    page,
    limit,
    search,
    warehouseCode,
  });

  ApiResponse.paginated(res, data, total, page, limit);
};

// ==================== GET DETAIL ====================

const getDetail = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as GetZoneDetailSchemaParams;

  const { data } = await zoneService.getDetail(code);

  ApiResponse.ok(res, 'OK', data);
};

// ==================== CREATE ====================

const create = async (req: Request, res: Response) => {
  const { code, warehouseCode, name, note } = req.validatedData?.body as CreateZoneSchemaBody;

  const result = await zoneService.create({
    data: {
      code,
      warehouseCode,
      name,
      note,
    },
    userId: req.user?.userId,
  });

  ApiResponse.created(res, 'OK', result);
};

// ==================== UPDATE ====================

const update = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as UpdateZoneSchemaParams;
  const { warehouseCode, name, note } = req.validatedData?.body as UpdateZoneSchemaBody;

  const result = await zoneService.update({
    code,
    data: {
      warehouseCode,
      name,
      note,
    },
    userId: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== DELETE ====================

const remove = async (req: Request, res: Response) => {
  const { code } = req.validatedData?.params as DeleteZoneSchemaParams;

  await zoneService.remove({
    code,
    userId: req.user?.userId,
  });

  ApiResponse.deleted(res);
};

// ==================== EXPORT ====================

export const zoneController = {
  getAll,
  getDetail,
  create,
  update,
  remove,
};
