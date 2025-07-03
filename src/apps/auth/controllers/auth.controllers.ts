import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse, sendResponse } from '@/pkg/response';
import { authSignInService, authSignUpService } from '@auth/services/auth.service';
import { BadRequestError, CustomError } from '@/pkg/error';
import { getLogger } from '@/core/logger';
import { createUserSchema } from './dto/createUser.dto';
import { signInSchema } from './dto/signin.dto';

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

export async function authSignInController(req: Request, res: Response) {
  const result = signInSchema.safeParse(req.body);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await authSignInService(req?.body.email, req?.body.password);

    sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      data: {
        name: user?.name,
        email: user?.email,
      },
    });
  } catch {
    sendErrorResponse({
      res,
      err: new BadRequestError('invalid username or password'),
    });
  }
}

export function authResetPassController(req: Request, res: Response) {
  console.log(req, res);
}
