import { appConfig } from '@/core/configs';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getLogger } from './core/logger';

async function initializeAPP() {
  const config = appConfig;
  const app: Express = express();
  const logger = getLogger();

  app.get('/health', (_req: Request, res: Response) => {
    logger.info('healthy');
    res.status(StatusCodes.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const { PORT } = config;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

initializeAPP();
