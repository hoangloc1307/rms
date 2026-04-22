import { Request, Response } from 'express';
import { importService } from '~/services';
import { ApiResponse } from '~/utils';
import { GetImportByCodeSchemaParams } from '~/validations';

// ==================== UPLOAD IMPORT ====================

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

// ==================== GET IMPORT BY CODE ====================

const getImportByCode = async (req: Request, res: Response) => {
  const { code } = req.params as GetImportByCodeSchemaParams;
  const result = await importService.getImportByCode(code);
  ApiResponse.ok(res, 'OK', result);
};

// ==================== EXPORT ====================

export const importController = {
  importUpload,
  getImportByCode,
};
