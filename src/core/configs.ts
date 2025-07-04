// src/core/config/config.ts
import dotenv from 'dotenv';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().min(10),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().nullable(),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type EnvConfig = z.infer<typeof envSchema>;

let cachedConfig: EnvConfig;

export function getConfig(): EnvConfig {
  if (!cachedConfig) {
    try {
      cachedConfig = envSchema.parse(process.env);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationError = fromZodError(err, {
          prefix: '❌ Invalid environment variables',
          prefixSeparator: '\n- ',
        });
        throw new Error(validationError.message);
      }
      throw err;
    }
  }
  return cachedConfig;
}

export const appConfig = getConfig();
