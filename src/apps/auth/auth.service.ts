import { BadRequestError, NotAuthorizedError } from '@/pkg/error';
import { comparePassword, hashPassword } from '@/pkg/hash';
import { generateSnowflakeId } from '@/pkg/snowflake';
import { authRepository, bloomUserRepository } from '@auth/auth.repository';
import { User } from '@prisma/client';

export async function authSignUpService(user: Omit<User, 'id'>): Promise<User> {
  const mightHaveEmail = await bloomUserRepository.mightHaveUserEmail(user.email);
  if (mightHaveEmail) {
    throw new BadRequestError('Bloom rejected: Email already in use');
  }
  const existing = await authRepository.findByEmail(user.email);
  if (existing) {
    throw new BadRequestError('Email already in use');
  }

  const hashedPassword = await hashPassword(user.password, 10);
  // add curent user email to bloom
  bloomUserRepository.addUserEmail(user.email);

  const newUser = await authRepository.createUser({
    ...user,
    userId: generateSnowflakeId(),
    password: hashedPassword,
  });

  return newUser;
}

export async function authRefreshService(userId: number): Promise<User> {
  const existing = await authRepository.findByUserId(String(userId));
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
