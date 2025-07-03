import { prisma } from '@/core/database/prisma';
import { User } from '@prisma/client';

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    return prisma.user.create({ data });
  },
};
