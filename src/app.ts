import bodyParser from 'body-parser';
import compression from 'compression';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { appConfig } from '@/core/configs';
import { getLogger } from '@/core/logger';
import { setupSwagger } from '@/core/swagger';
import { authRoutes } from '@auth/routes/auth.routes';
import { withLogger } from '@middlewares/logger';
import { withRateLimitMiddleware } from '@middlewares/ratelimmiter';

async function initializeAPP() {
  const app: Express = express();
  const config = appConfig;
  const logger = getLogger();

  setupSwagger(app);
  // Apply the rate limiter globally (all routes)
  app.use(withRateLimitMiddleware);

  // Set a 5-second request timeout globally
  app.use(timeout('5s'));

  // TODO: i must worry about partial failure with redis
  app.use((req, res, next) => {
    if (!req.timedout) next();
  });

  app.use(cookieParser());
  app.use(withLogger);

  // parse application/json
  app.use(bodyParser.json());

  // compress or gzip body response
  // Compression can leak information about secret tokens (e.g. CSRF tokens) via side-channel attacks like BREACH.
  // Disable compression on sensitive routes (e.g. /csrf, /auth/login).
  app.use(
    compression({
      filter: (req, res) => {
        const contentType = String(res.getHeader('Content-Type'));
        if (req.url.includes('/auth') || contentType?.includes('image')) return false;
        return compression.filter(req, res);
      },
    })
  );

  // healthcheck
  app.get('/health', (_: Request, res: Response) => {
    const error = new Error('test');
    logger.error('healthy', error);
    res.status(StatusCodes.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  authRoutes(app);

  const { PORT } = config;

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

initializeAPP();
