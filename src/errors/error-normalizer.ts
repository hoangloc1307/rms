import { AppError } from '~/errors';

export const normalizeBodyParserError = (err: Error & { type?: string }) => {
  if (err.type === 'entity.too.large') {
    return AppError.contentTooLarge('Payload too large');
  }

  if (err.type === 'entity.parse.failed') {
    return AppError.badRequest('Invalid JSON payload');
  }

  return err;
};
