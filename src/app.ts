import { appConfig } from '@/core/configs';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { withLogger } from '@middlewares/logger';
import { authRoutes } from '@auth/routes/auth.routes';
import { getLogger } from './core/logger';

async function initializeAPP() {
  const config = appConfig;
  const app: Express = express();
  const logger = getLogger();

  app.use(withLogger);

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
