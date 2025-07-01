import { loggerContext } from '@/core/logger/logger.context';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export function withAuth(req: Request, res: Response, next: NextFunction) {
  loggerContext.run({ userId: 'test', requestId: uuid() }, () => {
    next();
  });
}
