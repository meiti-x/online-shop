import { AsyncLocalStorage } from 'async_hooks';

interface LoggerContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  responseTime?: number; // MS
}

export const loggerContext = new AsyncLocalStorage<LoggerContext>();

export function getLoggerContext(): LoggerContext {
  return loggerContext.getStore() || {};
}
