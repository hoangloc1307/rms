import { Response } from 'express';
import { uploadService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';
import { GetUploadUrlSchemaBody } from '~/validations';

// ==================== GET UPLOAD URL ====================

const getUploadUrl = async (req: TypedRequest<GetUploadUrlSchemaBody>, res: Response) => {
  const { filename, contentType } = req.body;

  const result = await uploadService.generateUploadUrl(filename, contentType);

  ApiResponse.ok(res, 'OK', result);
};

// ==================== EXPORT ====================

export const uploadController = {
  getUploadUrl,
};
