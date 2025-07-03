import { BadRequestError } from '@/pkg/error';
import { hashPassword } from '@/pkg/hash';
import { authRepository } from '@auth/repository/auth.repository';
import { User } from '@prisma/client';

export async function authSignUpService(user: Omit<User, 'id'>): Promise<User> {
  const existing = await authRepository.findByEmail(user.email);
  if (existing) {
    throw new BadRequestError('Email already in use');
  }

  const hashedPassword = await hashPassword(user.password, 10);
  const newUser = await authRepository.createUser({
    ...user,
    password: hashedPassword,
  });

  return newUser;
}
