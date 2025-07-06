import { Response } from 'express';

import { AuthenticatedRequest } from '@middlewares/auth';
import { profileService } from '@profile/services/profile.services';

// export function updateProfileController(req: Request, res: Response) {}

export async function getProfileController(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string; // populated from auth middleware

  const user = await profileService.getUserByPublicId(userId);

  if (!user) res.status(404).json({ message: 'User not found' });

  res.json(user);
}
