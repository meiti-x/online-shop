import { Request } from 'express';

export function getClientIP(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.ip ||
    req.connection.remoteAddress ||
    'unknown'
  );
}
