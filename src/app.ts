import bodyParser from 'body-parser';
import compression from 'compression';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import { StatusCodes } from 'http-status-codes';

import { appConfig } from '@/core/configs';
import { getLogger } from '@/core/logger';
import { setupSwagger } from '@/core/swagger';
import { authRoutes } from '@auth/auth.routes';
import { withLogger } from '@middlewares/logger';
import { withRateLimitMiddleware } from '@middlewares/ratelimmiter';
import { profileRoutes } from '@profile/profile.routes';

import { productRoutes } from './apps/product/product.route';
import { connectDB } from './core/database/prisma';
import { getRedisClient } from './core/redis';
import { sendResponse } from './pkg/response';

async function shutdown(server: http.Server) {
  const logger = getLogger();
  const redis = getRedisClient();

  logger.info('📦 Shutting down...');

  server.close(async () => {
    try {
      logger.info('⛔ Closing server...');
      await redis.quit();
      logger.info('🟥 Redis disconnected');
      const { prisma } = await import('./core/database/prisma');
      await prisma.$disconnect();
      logger.info('🟦 Prisma disconnected');
      process.exit(0);
    } catch (err: any) {
      logger.error('❌ Error during shutdown', err);
      process.exit(1);
    }
  });
}

async function initializeAPP() {
  const app: Express = express();
  const logger = getLogger();
  const config = appConfig;

  try {
    await connectDB();
  } catch (err: any) {
    logger.error('❌ DB connection failed', err);
    process.exit(1);
  }

  await getRedisClient();

  setupSwagger(app);

  app.use(withRateLimitMiddleware);
  app.use(timeout('5s'));
  app.use((req, res, next) => {
    if (!req.timedout) next();
  });
  app.use(cookieParser());
  app.use(withLogger);
  app.use(bodyParser.json());
  app.use(
    compression({
      filter: (req, res) => {
        const contentType = String(res.getHeader('Content-Type'));
        if (req.url.includes('/auth') || contentType?.includes('image')) return false;
        return compression.filter(req, res);
      },
    })
  );

  app.get('/health', (_: Request, res: Response) => {
    sendResponse({
      res,
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      message: 'Healthy',
      statusCode: StatusCodes.OK,
    });
  });

  authRoutes(app);
  profileRoutes(app);
  productRoutes(app);

  const { PORT } = config;
  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
}

initializeAPP();
