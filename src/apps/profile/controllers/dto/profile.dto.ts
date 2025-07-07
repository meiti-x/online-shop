import { z } from 'zod';
import zxcvbn from 'zxcvbn';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  city: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
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

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
