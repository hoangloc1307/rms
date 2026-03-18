import { Response } from 'express';
import { HTTP_STATUS, HttpStatus } from '~/constants';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponseParams<T> {
  success: boolean;
  message: string;
  httpStatus: HttpStatus;
  data?: T | null;
  pagination?: Pagination;
}

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly httpStatus: HttpStatus;
  public readonly data?: T | null;
  public readonly pagination?: Pagination;

  constructor({ success, message, httpStatus, data = null, pagination }: ApiResponseParams<T>) {
    this.success = success;
    this.message = message;
    this.httpStatus = httpStatus;
    this.data = data;
    this.pagination = pagination;
  }

  send(res: Response): Response {
    return res.status(this.httpStatus).json({
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.pagination && { pagination: this.pagination }),
    });
  }

  static Success<T>(res: Response, message?: string, data?: T, httpStatus: HttpStatus = HTTP_STATUS.OK): Response {
    return new ApiResponse<T>({
      success: true,
      message: message || 'Success',
      data,
      httpStatus,
    }).send(res);
  }

  static Error<T>(
    res: Response,
    message: string,
    data?: T,
    httpStatus: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ): Response {
    return new ApiResponse<T>({
      success: false,
      message,
      data,
      httpStatus,
    }).send(res);
  }

  static ok<T>(res: Response, message = 'OK', data?: T) {
    return ApiResponse.Success(res, message, data, HTTP_STATUS.OK);
  }

  static created<T>(res: Response, message = 'Created', data?: T) {
    return ApiResponse.Success(res, message, data, HTTP_STATUS.CREATED);
  }

  static deleted(res: Response) {
    return ApiResponse.Success(res, '', null, HTTP_STATUS.NO_CONTENT);
  }

  static paginated<T>(res: Response, data: T, page: number, limit: number, totalItems: number, message = 'OK') {
    const totalPages = Math.ceil(totalItems / limit);

    return new ApiResponse<T>({
      success: true,
      message,
      data,
      httpStatus: HTTP_STATUS.OK,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    }).send(res);
  }
}
