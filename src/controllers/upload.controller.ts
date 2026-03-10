import { Response } from 'express';
import { uploadService } from '~/services';
import { TypedRequest } from '~/types/express';
import { ApiResponse } from '~/utils';
import { GetUploadUrlSchema } from '~/validations';

const getUploadUrl = async (req: TypedRequest<GetUploadUrlSchema>, res: Response) => {
  const { filename, contentType } = req.body;

  const result = await uploadService.generateUploadUrl(filename, contentType);

  ApiResponse.ok(res, 'OK', result);
};

export const uploadController = {
  getUploadUrl,
};
