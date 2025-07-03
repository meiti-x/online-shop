import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface ISendResponse {
  res: Response;
  statusCode: StatusCodes;
  data?: object;
  message?: string;
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
