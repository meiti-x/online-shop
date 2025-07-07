import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../error';

interface ISendResponse {
  res: Response;
  statusCode: StatusCodes;
  data?: object | null;
  message?: string;
}

interface ISendErrorResponse {
  res: Response;
  err: CustomError;
  fieldErrors?: Record<string, string[]>;
}
export function sendResponse(args: ISendResponse) {
  const { res, statusCode, data, message } = args;

  res.status(statusCode).json({
    data,
    message,
  });
}

export function sendErrorResponse(args: ISendErrorResponse) {
  const { res, err, fieldErrors } = args;

  if (res.headersSent) {
    console.error('❌ Tried to send error after response already sent');
    return;
  }
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
