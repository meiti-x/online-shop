import bcrypt from 'bcrypt';

export async function hashPassword(password: string, salt: number): Promise<string> {
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
