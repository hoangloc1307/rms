import { Request, Response } from 'express';
import { importService } from '~/services';
import { ApiResponse } from '~/utils';

const importUpload = async (req: Request, res: Response) => {
  const files = req.validatedData?.files;
  const body = req.validatedData?.body;

  const type = body?.type as string;
  const importFile = files?.importFile[0];

  const result = await importService.importUpload({
    file: importFile!,
    createdBy: req.user?.userId,
    type,
  });

  ApiResponse.ok(res, 'Imported successfully', result);
};

export const importController = {
  importUpload,
};
