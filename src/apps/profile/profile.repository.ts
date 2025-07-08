import { prisma } from '@/core/database/prisma';
import { Email } from '@/types/general';
import { User } from '@prisma/client';
import { UpdateProfileDto } from '@profile/dto/profile.dto';

export const profileRepository = {
  findByUserId(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  },
  findByUserEmail(email: Email): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },
  updateByUserId(userId: string, data: Partial<UpdateProfileDto>): Promise<User | null> {
    return prisma.user.update({
      where: { userId },
      data,
    });
  },
};
