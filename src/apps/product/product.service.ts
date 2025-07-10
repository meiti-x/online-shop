import { generateSnowflakeId } from '@/pkg/snowflake';

import { CreateProductDto } from './dto/create-product.dto';
import { productRepository } from './product.repository';

export const productService = {
  async createProduct(payload: CreateProductDto) {
    const productId = generateSnowflakeId();
    const data = {
      productId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      prices: {
        create: {
          priceId: generateSnowflakeId(),
          price: payload.price,
          discount: payload.discount ?? 0,
        },
      },
      stock: {
        create: {
          stockId: generateSnowflakeId(),
          quantity: payload.stock,
        },
      },
      images: {
        create: payload.images?.map((img) => ({
          imageId: generateSnowflakeId(),
          ...img,
        })),
      },
    };

    return productRepository.create(data);
  },

  async getProductById(productId: string) {
    return productRepository.findById(productId);
  },

  async searchProducts(query: any) {
    return productRepository.search(query);
  },

  async updateProduct(productId: string, data: Partial<CreateProductDto>) {
    return productRepository.update(productId, data);
  },

  async deleteProduct(productId: string) {
    return productRepository.delete(productId);
  },
};
