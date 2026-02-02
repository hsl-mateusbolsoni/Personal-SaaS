import type { Invoice } from '../../types/invoice';

export interface IInvoiceRepository {
  getAll(userId?: string): Promise<Invoice[]>;
  getById(id: string, userId?: string): Promise<Invoice | null>;
  create(invoice: Invoice): Promise<Invoice>;
  update(id: string, updates: Partial<Invoice>): Promise<Invoice>;
  delete(id: string): Promise<void>;
  search(query: string, userId?: string): Promise<Invoice[]>;
}
