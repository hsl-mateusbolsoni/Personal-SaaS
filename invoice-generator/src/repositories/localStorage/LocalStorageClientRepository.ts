import type { IClientRepository } from '../interfaces/ClientRepository';
import type { Client } from '../../types/client';
import { useClientStore } from '../../stores/useClientStore';

export class LocalStorageClientRepository implements IClientRepository {
  async getAll(_userId?: string): Promise<Client[]> {
    return useClientStore.getState().clients;
  }

  async getById(id: string, _userId?: string): Promise<Client | null> {
    return useClientStore.getState().clients.find((c) => c.id === id) || null;
  }

  async create(client: Client): Promise<Client> {
    useClientStore.getState().addClient(client);
    return client;
  }

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    useClientStore.getState().updateClient(id, updates);
    const updated = await this.getById(id);
    if (!updated) throw new Error('Client not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    useClientStore.getState().deleteClient(id);
  }

  async updateLastUsed(id: string): Promise<void> {
    useClientStore.getState().updateClient(id, {
      lastUsed: new Date().toISOString(),
    });
  }
}
