import { PrismaClient } from '@prisma/client';
import { ModelMap, Database } from '../../types/Database';

export class PrismaDatabase implements Database {
  private prisma = new PrismaClient();

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  async create<K extends keyof ModelMap>(model: K, data: ModelMap[K]): Promise<ModelMap[K]> {
    return this.prisma[model].create({ data });
  }

  async update<K extends keyof ModelMap>(
    model: K,
    id: string,
    data: Partial<ModelMap[K]>
  ): Promise<ModelMap[K] | null> {
    return this.prisma[model].update({
      where: { id: Number(id) }, // adjust id type if string in your schema
      data,
    });
  }

  async delete<K extends keyof ModelMap>(model: K, id: string): Promise<void> {
    await this.prisma[model].delete({
      where: { id: Number(id) },
    });
  }

  async findById<K extends keyof ModelMap>(model: K, id: string): Promise<ModelMap[K] | null> {
    return this.prisma[model].findUnique({
      where: { id: Number(id) },
    });
  }

  async findMany<K extends keyof ModelMap>(model: K, filter?: Partial<ModelMap[K]>): Promise<ModelMap[K][]> {
    return this.prisma[model].findMany({
      where: filter,
    });
  }
}
