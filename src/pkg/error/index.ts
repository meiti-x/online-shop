/* eslint-disable no-useless-constructor */
// eslint-disable-next-line max-classes-per-file
import { StatusCodes } from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;

  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class PermissionDeniedError extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;

  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export interface ErrorNoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}
