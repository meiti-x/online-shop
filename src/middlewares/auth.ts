import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { verifyAccessToken } from '@/pkg/jwt';
import { Email } from '@/types/general';

interface JwtPayload {
  email: Email;
  userId: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

export function withAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token cookie missing' });
    return;
  }

  try {
    const payload = verifyAccessToken(token) as JwtPayload;
    if (!payload.email) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token payload' });
      return;
    }

    req.user = { userId: payload.userId, email: payload.email };

    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
}
