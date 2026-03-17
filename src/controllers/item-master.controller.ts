import { Request, Response } from 'express';
import { itemMasterService } from '~/services';
import { ApiResponse } from '~/utils';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;

  const result = await itemMasterService.getAll({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  ApiResponse.paginated(res, result, Number(page), Number(limit), result.total);
};

export const itemMasterController = { getAll };
