import { PrismaClient } from '@prisma/client';

import { generateSnowflakeId } from '../../src/pkg/snowflake';

const prisma = new PrismaClient();

async function main() {
  // Create Category: Mobile
  const mobileCategoryId = generateSnowflakeId();
  await prisma.category.create({
    data: {
      categoryId: mobileCategoryId,
      name: 'Mobile',
    },
  });

  // Attributes: RAM, Storage, Color
  await prisma.categoryAttribute.createMany({
    data: [
      {
        attributeId: generateSnowflakeId(),
        categoryId: mobileCategoryId,
        name: 'RAM',
        type: 'number',
      },
      {
        attributeId: generateSnowflakeId(),
        categoryId: mobileCategoryId,
        name: 'Storage',
        type: 'number',
      },
      {
        attributeId: generateSnowflakeId(),
        categoryId: mobileCategoryId,
        name: 'Color',
        type: 'string',
      },
    ],
  });

  // Create Product
  const productId = generateSnowflakeId();
  await prisma.product.create({
    data: {
      productId,
      title: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro, 256GB, Space Black',
      categoryId: mobileCategoryId,
      images: {
        create: [
          {
            imageId: generateSnowflakeId(),
            url: 'https://example.com/iphone15.jpg',
            alt: 'Front view of iPhone 15 Pro',
          },
        ],
      },
      prices: {
        create: {
          priceId: generateSnowflakeId(),
          price: 120000, // in cents
          discount: 10,
        },
      },
      stock: {
        create: {
          stockId: generateSnowflakeId(),
          quantity: 50,
        },
      },
    },
  });

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
