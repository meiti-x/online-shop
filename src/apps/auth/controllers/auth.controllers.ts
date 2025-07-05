import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getLogger } from '@/core/logger';
import { BadRequestError, CustomError, NotAuthorizedError } from '@/pkg/error';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/pkg/jwt';
import { sendErrorResponse, sendResponse } from '@/pkg/response';
import { authRefreshService, authSignInService, authSignUpService } from '@auth/services/auth.service';

import { createUserDto } from './dto/createUser.dto';
import { signInDto } from './dto/signin.dto';

export function authSignUpController(req: Request, res: Response) {
  const result = createUserDto.safeParse(req.body);
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
      res
        .cookie('accessToken', generateAccessToken({ email: req.body.email }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie('refreshToken', generateRefreshToken({ email: req.body.email }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

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
  const result = signInDto.safeParse(req.body);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await authSignInService(req?.body.email, req?.body.password);

    res
      .cookie('accessToken', generateAccessToken({ email: req.body.email }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie('refreshToken', generateRefreshToken({ email: req.body.email }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

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

export async function authRefreshTokenController(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing refresh token' });
  }

  try {
    const payload = verifyRefreshToken(String(refreshToken));
    const { userId, email } = payload as { userId: number; email: string };

    await authRefreshService(req?.body.email);

    const newAccessToken = generateAccessToken({ userId, email });
    const newRefreshToken = generateRefreshToken({ userId, email });

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(StatusCodes.OK)
      .json({ message: 'Tokens refreshed' });
  } catch {
    sendErrorResponse({
      res,
      err: new NotAuthorizedError('Invalid or expired refresh token'),
    });
  }
}

export function authResetPassController(req: Request, res: Response) {
  console.log(req, res);
}
