import type { IInvoiceRepository } from '../interfaces/InvoiceRepository';
import type { Invoice } from '../../types/invoice';
import { useInvoiceStore } from '../../stores/useInvoiceStore';

export class LocalStorageInvoiceRepository implements IInvoiceRepository {
  async getAll(_userId?: string): Promise<Invoice[]> {
    return useInvoiceStore.getState().invoices;
  }

  async getById(id: string, _userId?: string): Promise<Invoice | null> {
    return useInvoiceStore.getState().invoices.find((inv) => inv.id === id) || null;
  }

  async create(invoice: Invoice): Promise<Invoice> {
    useInvoiceStore.getState().addInvoice(invoice);
    return invoice;
  }

  async update(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    useInvoiceStore.getState().updateInvoice(id, updates);
    const updated = await this.getById(id);
    if (!updated) throw new Error('Invoice not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    useInvoiceStore.getState().deleteInvoice(id);
  }

  async search(query: string, _userId?: string): Promise<Invoice[]> {
    const invoices = await this.getAll();
    const q = query.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.to.name.toLowerCase().includes(q)
    );
  }
}
