import { prisma } from '@/core/database/prisma';
import { User } from '@prisma/client';

export const profileRepository = {
  findByUserId(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  },
};
