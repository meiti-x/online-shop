import { Application } from 'express';

import { withAuth } from '@middlewares/auth';
import { getProfileController } from '@profile/controllers/profile.controllers';

export function profileRoutes(app: Application) {
  app.use(withAuth);
  app.get('/api/v1/profile', getProfileController);
  //   app.patch('/api/v1/profile', getProfileController);
}
