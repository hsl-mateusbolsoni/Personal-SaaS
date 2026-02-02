import type { IClientRepository } from '../repositories/interfaces/ClientRepository';
import type { Client } from '../types/client';
import { eventBus } from '../utils/events';

export class ClientService {
  clientRepo: IClientRepository;

  constructor(clientRepo: IClientRepository) {
    this.clientRepo = clientRepo;
  }

  async createClient(data: { name: string; email: string; phone: string; address: string }): Promise<Client> {
    const client: Client = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      invoiceCount: 0,
    };
    eventBus.emit('client:created', client);
    return this.clientRepo.create(client);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    return this.clientRepo.update(id, data);
  }

  async deleteClient(id: string): Promise<void> {
    return this.clientRepo.delete(id);
  }

  async getAllClients(): Promise<Client[]> {
    return this.clientRepo.getAll();
  }
}
