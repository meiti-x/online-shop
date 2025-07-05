import jwt from 'jsonwebtoken';

import { getConfig } from '@/core/configs';

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET } = getConfig();

export function generateAccessToken(payload: object): string {
  // @ts-ignore
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN as string | number });
}

export function verifyAccessToken<T>(token: string): T {
  return jwt.verify(token, JWT_ACCESS_SECRET) as T;
}

export function generateRefreshToken(payload: object): string {
  // @ts-ignore
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as string | number });
}

export function verifyRefreshToken<T>(token: string): T {
  return jwt.verify(token, JWT_REFRESH_SECRET) as T;
}
