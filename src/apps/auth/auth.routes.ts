import { Express } from 'express';

import {
  authRefreshTokenController,
  authResetPassController,
  authSignInController,
  authSignUpController,
} from '@auth/auth.controllers';

export function authRoutes(app: Express) {
  /**
   * @openapi
   * /api/v1/auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: Created
   */
  app.post('/api/v1/auth/signup', authSignUpController);

  /**
   * @openapi
   * /api/v1/auth/signin:
   *   post:
   *     summary: Login a user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginUserDto'
   *     responses:
   *       200:
   *         description: Successfully logged in
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: access_token=abc123; HttpOnly; Path=/; Max-Age=3600
   *             description: Sets access and refresh tokens in HttpOnly cookies   */
  app.post('/api/v1/auth/signin', authSignInController);

  /**
   * @openapi
   * /api/v1/auth/refresh:
   *   post:
   *     summary: Refresh user access and refresh token
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginUserDto'
   *     responses:
   *       200:
   *         description: Successfully refreshed tokens (set in cookies)
   *         headers:
   *           Set-Cookie:
   *             description: |
   *               Sets access_token and refresh_token in HttpOnly cookies.
   *               Example:
   *                 access_token=abc123; HttpOnly; Path=/; Max-Age=3600
   *                 refresh_token=def456; HttpOnly; Path=/; Max-Age=604800
   *             schema:
   *               type: string
   *               example: access_token=abc123; HttpOnly; Path=/; Max-Age=3600
   *       401:
   *         description: Unauthorized — refresh token is missing, expired, or invalid
   */
  app.post('/api/v1/auth/refresh', authRefreshTokenController);

  app.post('/api/v1/auth/reset-pass', authResetPassController);
}
