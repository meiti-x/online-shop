import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { PermissionDeniedError } from '@/pkg/error';
import { verifyAccessToken } from '@/pkg/jwt';
import { sendErrorResponse } from '@/pkg/response';

interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: 'user' | 'admin' };
}

export function withAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token cookie missing' });
    return;
  }

  try {
    const payload = verifyAccessToken(token) as JwtPayload;
    if (!payload.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token payload' });
      return;
    }

    req.user = { userId: payload.userId, role: payload.role };

    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
}

export function withAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.role || req.user?.role !== 'admin') {
    sendErrorResponse({
      res,
      err: new PermissionDeniedError('you dont have permission to operate this action'),
    });
    return;
  }

  next();
}
