/* eslint-disable no-param-reassign */
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import type { ILogger } from '@types';
import { loggerContext } from './logger.context';

const dailyRotateTransport = new transports.DailyRotateFile({
  dirname: path.join(__dirname, '../../logs'),
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '14d',
  zippedArchive: true,
  level: 'info',
});

const contextFormat = format((info) => {
  const context = loggerContext.getStore();

  if (context?.userId) info.userId = context.userId;
  if (context?.requestId) info.requestId = context.requestId;
  if (context?.method) info.method = context.method;
  if (context?.url) info.url = context.url;
  if (context?.responseTime) info.responseTime = context.responseTime;

  return info;
});

const loggerInstance = createLogger({
  level: 'info',
  format: format.combine(
    contextFormat(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    dailyRotateTransport,
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  loggerInstance.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          // eslint-disable-next-line max-len
          return `${timestamp} ${level}: ${message}\n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}\n`;
        })
      ),
    })
  );
}

export function getLogger(): ILogger {
  return {
    info(message: string, meta?: object): void {
      loggerInstance.info(message, meta);
    },
    warn(message: string, meta?: object): void {
      loggerInstance.warn(message, meta);
    },
    error(message: string, meta?: object): void {
      loggerInstance.error(message, meta);
    },
    debug(message: string, meta?: object): void {
      loggerInstance.debug(message, meta);
    },
  };
}
