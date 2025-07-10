// src/core/db.ts
import { PrismaClient } from '@prisma/client';

import { getLogger } from '../logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

let isConnected = false;

export async function connectDB() {
  const logger = getLogger();
  if (!isConnected) {
    logger.info('🏗️ Connecting to DB...');
    await prisma.$connect();
    logger.info('🟢 Prisma connected');
    isConnected = true;
  }
}

export async function disconnectDB() {
  const logger = getLogger();

  if (isConnected) {
    await prisma.$disconnect();
    isConnected = false;
    logger.info('🔌 Prisma disconnected');
  }
}

export { prisma };
