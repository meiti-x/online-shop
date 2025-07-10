import { prisma } from '@/core/database/prisma';
import { NotFoundError } from '@/pkg/error';

export const productRepository = {
  create(data: any) {
    return prisma.product.create({ data });
  },

  async findById(productId: string) {
    const res = await prisma.product.findUnique({
      where: { productId },
      include: {
        prices: { orderBy: { createdAt: 'desc' }, take: 1 },
        stock: true,
        images: true,
        attributes: { include: { attribute: true } },
      },
    });

    if (!res) {
      throw new NotFoundError('Product not found');
    }
    return res;
  },

  search(query: any) {
    const { title, categoryId } = query;
    return prisma.product.findMany({
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        categoryId,
      },
      include: { prices: true },
    });
  },

  async update(productId: string, data: any) {
    try {
      return await prisma.product.update({
        where: { productId },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundError('Product not found');
      }
      throw error;
    }
  },

  async delete(productId: string) {
    try {
      return await prisma.product.delete({
        where: { productId },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundError('Product not found');
      }
      throw error;
    }
  },
};
