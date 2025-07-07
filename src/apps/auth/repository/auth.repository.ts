import { prisma } from '@/core/database/prisma';
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
