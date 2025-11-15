import { Response } from 'express';

export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
  meta?: Record<string, any>;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; issue: string }>;
    request_id?: string;
  };
}

export class ResponseHandler {
  // Flexible success method - works with old AND new calling patterns
  static success<T>(
    res: Response, 
    data: T, 
    messageOrPagination?: string | PaginationMeta,
    pagination?: PaginationMeta
  ): void {
    const response: SuccessResponse<T> = { data };
    
    // Handle different calling patterns
    if (typeof messageOrPagination === 'string') {
      // New pattern: success(res, data, message, pagination)
      response.message = messageOrPagination;
      if (pagination) response.pagination = pagination;
    } else if (messageOrPagination && typeof messageOrPagination === 'object') {
      // Old pattern: success(res, data, pagination)
      response.pagination = messageOrPagination;
    }
    
    res.status(200).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): void {
    const response: SuccessResponse<T> = { data };
    if (message) response.message = message;
    res.status(201).json(response);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: Array<{ field?: string; issue: string }>,
    requestId?: string
  ): void {
    const response: ErrorResponse = {
      error: {
        code,
        message,
        ...(details && { details }),
        ...(requestId && { request_id: requestId }),
      },
    };
    res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string, details?: Array<{ field?: string; issue: string }>, requestId?: string): void {
    this.error(res, 400, 'BAD_REQUEST', message, details, requestId);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized', requestId?: string): void {
    this.error(res, 401, 'UNAUTHORIZED', message, undefined, requestId);
  }

  static forbidden(res: Response, message: string = 'Forbidden', requestId?: string): void {
    this.error(res, 403, 'FORBIDDEN', message, undefined, requestId);
  }

  static notFound(res: Response, resource: string = 'Resource', requestId?: string): void {
    this.error(res, 404, 'RESOURCE_NOT_FOUND', `${resource} not found`, undefined, requestId);
  }

  static conflict(res: Response, message: string, requestId?: string): void {
    this.error(res, 409, 'CONFLICT', message, undefined, requestId);
  }

  static internalError(res: Response, message: string = 'Internal server error', requestId?: string): void {
    this.error(res, 500, 'INTERNAL_SERVER_ERROR', message, undefined, requestId);
  }
}
