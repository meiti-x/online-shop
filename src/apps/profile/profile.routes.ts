import { Application } from 'express';

import { withAuth } from '@middlewares/auth';
import { getProfileController, updateProfileController } from '@profile/profile.controllers';

export function profileRoutes(app: Application) {
  app.get('/api/v1/profile', withAuth, getProfileController);
  app.patch('/api/v1/profile', withAuth, updateProfileController);
}
