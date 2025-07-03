import {
  authResetPassController,
  authSignInController,
  authSignUpController,
} from '@auth/controllers/auth.controllers';
import { Express } from 'express';

export function authRoutes(app: Express) {
  app.post('/api/v1/auth/signup', authSignUpController);
  app.post('/api/v1/auth/signin', authSignInController);
  app.post('/api/v1/auth/reset-pass', authResetPassController);
}
