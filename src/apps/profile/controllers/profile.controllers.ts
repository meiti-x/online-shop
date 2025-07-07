import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError, NotFoundError } from '@/pkg/error';
import { sendErrorResponse, sendResponse } from '@/pkg/response';
import { AuthenticatedRequest } from '@middlewares/auth';
import { profileService } from '@profile/services/profile.services';

import { updateProfileSchema } from './dto/profile.dto';

export async function getProfileController(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string;

  const user = await profileService.getUserByPublicId(userId);

  if (!user) {
    sendErrorResponse({
      res,
      err: new NotFoundError('User Not Found'),
    });
    return;
  }

  res.json(user);
}

export async function updateProfileController(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    sendErrorResponse({
      res,
      err: new NotAuthorizedError('please first login'),
    });
    return;
  }

  const parseResult = updateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendErrorResponse({
      res,
      err: new BadRequestError('invalid input'),
      fieldErrors: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const userEmail = parseResult?.data?.email as string;
  if (userEmail) {
    // check new email exist on the db
    const isEmailExist = await profileService.getUserByEmail(userEmail);

    if (isEmailExist) {
      sendErrorResponse({
        res,
        err: new BadRequestError('Email already exist choose another email'),
      });
    }
  }

  profileService
    .updateUser(userId, parseResult.data)
    .then((data) =>
      sendResponse({
        res,
        message: 'User updated successfuly',
        statusCode: StatusCodes.OK,
        data,
      })
    )
    .catch((err) => {
      sendErrorResponse({
        res,
        err,
      });
    });
}
