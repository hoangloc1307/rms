import { Request, Response } from 'express';
import { inventoryService } from '~/services';
import { ApiResponse } from '~/utils';
import { CheckLabelExistsSchemaParams } from '~/validations';

const checkLabelExists = async (req: Request, res: Response) => {
  const { labelId } = req.params as CheckLabelExistsSchemaParams;

  await inventoryService.checkLabelExists(labelId);

  return ApiResponse.Success(res, 'OK');
};

export const inventoryController = {
  checkLabelExists,
};
