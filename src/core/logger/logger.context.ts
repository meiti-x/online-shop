import { AsyncLocalStorage } from 'async_hooks';

interface LoggerContext {
  userId?: string;
  requestId?: string;
}

export const loggerContext = new AsyncLocalStorage<LoggerContext>();

export function getLoggerContext(): LoggerContext {
  return loggerContext.getStore() || {};
}
