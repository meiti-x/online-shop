import { getLogger } from '@/core/logger';
import { loggerContext } from '@/core/logger/logger.context';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export function withLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();

  loggerContext.run({ userId: 'test', requestId: uuid(), method: req?.method, url: req?.url }, () => {
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - startTime) / 1_000_000;

      const store = loggerContext.getStore();
      if (store) {
        store.responseTime = durationMs;
      }

      const logger = getLogger();
      logger.info('HTTP Request', {
        method: store?.method,
        url: store?.url,
        statusCode: res.statusCode,
        userId: store?.userId,
        requestId: store?.requestId,
        responseTime: store?.responseTime?.toFixed(2),
      });
    });

    next();
  });
}
