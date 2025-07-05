import { Express } from 'express';

import {
  authRefreshTokenController,
  authResetPassController,
  authSignInController,
  authSignUpController,
} from '@auth/controllers/auth.controllers';

export function authRoutes(app: Express) {
  app.post('/api/v1/auth/signup', authSignUpController);
  app.post('/api/v1/auth/signin', authSignInController);
  app.post('/api/v1/auth/refresh', authRefreshTokenController);
  app.post('/api/v1/auth/reset-pass', authResetPassController);
}
