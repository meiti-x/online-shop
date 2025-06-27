import { appConfig } from '@utils/configs';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

function initializeAPP() {
  const config = appConfig;
  const app: Express = express();

  app.get('/health', (_req: Request, res: Response) => {
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
