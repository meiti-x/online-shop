import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

function initializeAPP() {
  const app: Express = express();

  app.get('/health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

initializeAPP();
