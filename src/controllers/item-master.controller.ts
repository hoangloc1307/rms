import { NextFunction, Request, Response } from 'express';
import { itemMasterService } from '~/services';
import { ApiResponse } from '~/utils';
import {
  CreateItemMasterSchemaBody,
  DeleteItemMasterSchemaParams,
  GetItemMasterDetailSchemaParams,
  PaginationSchemaQuery,
  UpdateItemMasterSchemaBody,
  UpdateItemMasterSchemaParams,
} from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search } = req.validatedData?.query as PaginationSchemaQuery;

  const result = await itemMasterService.getAll({
    page,
    limit,
    search,
  });

  ApiResponse.paginated(res, result.data, page, limit, result.total);
};

// ==================== GET DETAIL ====================

const getItemMasterDetail = async (req: Request, res: Response) => {
  const { itemCode } = req.validatedData?.params as GetItemMasterDetailSchemaParams;

  const result = await itemMasterService.getItemMasterDetail(itemCode);

  ApiResponse.ok(res, 'OK', result.data);
};

// ==================== CREATE ITEM MASTER ====================

const createItemMaster = async (req: Request, res: Response) => {
  const { itemCode, productCode, name, unit, baseUnit, conversionFactor, deliveryOnBaseUnit, note } = req.validatedData
    ?.body as CreateItemMasterSchemaBody;

  const result = await itemMasterService.createItemMaster({
    data: {
      itemCode,
      productCode,
      name,
      unit,
      baseUnit,
      conversionFactor,
      deliveryOnBaseUnit,
      note,
    },
    createdBy: req.user?.userId,
  });

  ApiResponse.created(res, 'OK', result);
};

// ==================== DELETE ITEM MASTER ====================

const deleteItemMaster = async (req: Request, res: Response) => {
  const { itemCode } = req.validatedData?.params as DeleteItemMasterSchemaParams;

  await itemMasterService.deleteItemMaster({
    itemCode,
    updatedBy: req.user?.userId,
  });

  ApiResponse.deleted(res);
};

// ==================== UPDATE ITEM MASTER ====================

const updateItemMaster = async (req: Request, res: Response) => {
  const { itemCode } = req.validatedData?.params as UpdateItemMasterSchemaParams;
  const { productCode, name, unit, baseUnit, conversionFactor, deliveryOnBaseUnit, note } = req.validatedData
    ?.body as UpdateItemMasterSchemaBody;

  const result = await itemMasterService.updateItemMaster({
    itemCode,
    data: {
      productCode,
      name,
      unit,
      baseUnit,
      conversionFactor,
      deliveryOnBaseUnit,
      note,
    },
    updatedBy: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK', result);
};

// ==================== IMPORT ====================

const importItemMaster = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.validatedData?.files;
  const itemMasterFile = files!.itemMasterFile[0];

  await itemMasterService.importItemMaster({
    file: itemMasterFile,
    createdBy: req.user?.userId,
  });

  ApiResponse.ok(res, 'OK');
};

// ==================== EXPORT ====================

export const itemMasterController = {
  getAll,
  getItemMasterDetail,
  createItemMaster,
  deleteItemMaster,
  updateItemMaster,
  importItemMaster,
};
