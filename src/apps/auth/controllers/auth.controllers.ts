import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/pkg/response';
import { createUserSchema } from './dto/createUser.dto';

export function authSignUpController(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      fieldErrors: result.error.flatten().fieldErrors,
    });
    return;
  }
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    data: {
      ...req.body,
    },
    message: 'User Created Successfully',
  });
}
export function authSignInController(req: Request, res: Response) {
  console.log(req, res);
}
export function authResetPassController(req: Request, res: Response) {
  console.log(req, res);
}
