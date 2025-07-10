import { prisma } from '@/core/database/prisma';
import { getRedisClient } from '@/core/redis';
import { Email } from '@/types/general';
import { User } from '@prisma/client';

export const authRepository = {
  async findByEmail(email: Email): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByUserId(userId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { userId } });
  },
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    return prisma.user.create({ data });
  },
};

export const bloomUserRepository = {
  async addUserEmail(email: string) {
    const redis = getRedisClient();
    return redis.call('BF.ADD', 'user_emails', email);
  },

  async mightHaveUserEmail(email: string) {
    const redis = getRedisClient();
    const res = await redis.call('BF.EXISTS', 'user_emails', email);
    return res === 1;
  },
};
