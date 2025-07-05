import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { getRedisClient } from '@/core/redis';
import { getClientIP } from '@/pkg/getClientIp';

const rateLimiter = new RateLimiterRedis({
  storeClient: getRedisClient(),
  keyPrefix: 'rate-limit',
  points: 100, // Number of requests
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 5,
});

export function withRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  rateLimiter
    .consume(getClientIP(req))
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: 'Too many requests, please try again later.',
      });
    });
}
