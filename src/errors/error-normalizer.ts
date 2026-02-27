import { HTTP_STATUS } from '~/constants';
import { AppError } from '~/errors';

export const normalizeBodyParserError = (err: Error & { type?: string }) => {
  if (err.type === 'entity.too.large') {
    return new AppError({
      message: 'Payload too large',
      httpStatusCode: HTTP_STATUS.CONTENT_TOO_LARGE,
      errorCode: 'PAYLOAD_TOO_LARGE',
    });
  }

  if (err.type === 'entity.parse.failed') {
    return new AppError({
      message: 'Invalid JSON payload',
      httpStatusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: 'INVALID_JSON_PAYLOAD',
    });
  }

  return err;
};
