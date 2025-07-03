import { z } from 'zod';
import zxcvbn from 'zxcvbn';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name must be at most 50 characters long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    // denay valid but still easy password to follow OWASP rules
    .refine(
      (val) => {
        const strength = zxcvbn(val);
        return strength.score >= 3;
      },
      {
        message: 'Password is too weak. Try adding uncommon words, numbers, or symbols.',
      }
    ),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
