import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../error';

interface ISendResponse {
  res: Response;
  statusCode: StatusCodes;
  data?: object;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

interface ISendErrorResponse {
  res: Response;
  err: CustomError;
  fieldErrors?: Record<string, string[]>;
}
export function sendResponse(args: ISendResponse) {
  const { res, statusCode, data, message, fieldErrors } = args;

  res.status(statusCode).json({
    data,
    message,
    fieldErrors,
  });
}

export function sendErrorResponse(args: ISendErrorResponse) {
  const { res, err, fieldErrors } = args;
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
      fieldErrors,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'something went wrong',
    });
  }
}
