import { User } from '@prisma/client';

export interface ModelMap {
  user: User;
}

export type ModelsName = keyof ModelMap;

export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  create<K extends keyof ModelMap>(model: K, data: ModelMap[K]): Promise<ModelMap[K]>;
  update<K extends keyof ModelMap>(model: K, id: string, data: Partial<ModelMap[K]>): Promise<ModelMap[K] | null>;
  delete<K extends keyof ModelMap>(model: K, id: string): Promise<void>;
  findById<K extends keyof ModelMap>(model: K, id: string): Promise<ModelMap[K] | null>;
  findMany<K extends keyof ModelMap>(model: K, filter?: Partial<ModelMap[K]>): Promise<ModelMap[K][]>;
}
