import { z } from 'zod';

export const signInDto = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
