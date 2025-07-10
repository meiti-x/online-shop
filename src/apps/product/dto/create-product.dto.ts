import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  categoryId: z.string(),
  price: z.number().int().min(0),
  discount: z.number().int().min(0).max(100).optional(),
  stock: z.number().int().min(0),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      })
    )
    .optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
