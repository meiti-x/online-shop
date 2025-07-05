import { BadRequestError, NotAuthorizedError } from '@/pkg/error';
import { comparePassword, hashPassword } from '@/pkg/hash';
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

export async function authRefreshService(user: Omit<User, 'id'>): Promise<User> {
  const existing = await authRepository.findByEmail(user.email);
  if (!existing) {
    throw new BadRequestError('Email not exist');
  }

  return existing;
}

export async function authSignInService(email: string, password: string) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new NotAuthorizedError('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new NotAuthorizedError('Invalid credentials');
  }

  // Optionally: return a JWT token or user info here
  return user;
}
