import type { Client } from '../../types/client';

export interface IClientRepository {
  getAll(userId?: string): Promise<Client[]>;
  getById(id: string, userId?: string): Promise<Client | null>;
  create(client: Client): Promise<Client>;
  update(id: string, updates: Partial<Client>): Promise<Client>;
  delete(id: string): Promise<void>;
  updateLastUsed(id: string): Promise<void>;
}
