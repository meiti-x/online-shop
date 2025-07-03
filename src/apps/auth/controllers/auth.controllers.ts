import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse, sendResponse } from '@/pkg/response';
import { authSignUpService } from '@auth/services/auth.service';
import { BadRequestError, CustomError } from '@/pkg/error';
import { getLogger } from '@/core/logger';
import { createUserSchema } from './dto/createUser.dto';

export function authSignUpController(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);
  const logger = getLogger();
  if (!result.success) {
    sendErrorResponse({
      res,
      err: new BadRequestError('please fix field errors'),
      fieldErrors: result.error.flatten().fieldErrors,
    });
    return;
  }
  authSignUpService(req.body)
    .then(() => {
      sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        data: {
          ...req.body,
        },
        message: 'User Created Successfully',
      });
    })
    .catch((err: CustomError) => {
      logger.error(err.message, err);

      sendErrorResponse({ res, err });
    });
}
export function authSignInController(req: Request, res: Response) {
  console.log(req, res);
}
export function authResetPassController(req: Request, res: Response) {
  console.log(req, res);
}
