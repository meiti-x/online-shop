import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export function withAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token cookie missing' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!payload.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token payload' });
      return;
    }

    req.user = { userId: payload.userId };

    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
}
