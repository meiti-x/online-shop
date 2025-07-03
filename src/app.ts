import { appConfig } from '@/core/configs';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { withLogger } from '@middlewares/logger';
import { authRoutes } from '@auth/routes/auth.routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import { getLogger } from './core/logger';

async function initializeAPP() {
  const app: Express = express();
  const config = appConfig;
  const logger = getLogger();

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

  app.use(withLogger);

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
