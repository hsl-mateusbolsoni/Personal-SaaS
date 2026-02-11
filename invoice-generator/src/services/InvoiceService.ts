import type { IInvoiceRepository } from '../repositories/interfaces/InvoiceRepository';
import type { IClientRepository } from '../repositories/interfaces/ClientRepository';
import type { ISettingsRepository } from '../repositories/interfaces/SettingsRepository';
import type { Invoice } from '../types/invoice';
import type { AppSettings } from '../types/settings';
import { calculateInvoiceTotals } from '../utils/currency';
import { eventBus } from '../utils/events';

export class InvoiceService {
  invoiceRepo: IInvoiceRepository;
  clientRepo: IClientRepository;
  settingsRepo: ISettingsRepository;

  constructor(
    invoiceRepo: IInvoiceRepository,
    clientRepo: IClientRepository,
    settingsRepo: ISettingsRepository
  ) {
    this.invoiceRepo = invoiceRepo;
    this.clientRepo = clientRepo;
    this.settingsRepo = settingsRepo;
  }

  async createInvoice(draft: Partial<Invoice>): Promise<Invoice> {
    const settings = await this.settingsRepo.get();
    const appSettings = await this.settingsRepo.getAppSettings();
    const invoiceNumber = draft.invoiceNumber || this.generateInvoiceNumber(appSettings);
    const taxRate = draft.taxRate ?? appSettings.defaultTaxRate;
    const items = draft.items || [];
    const discount = draft.discount || null;
    const totals = calculateInvoiceTotals(items, taxRate, discount);

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber,
      date: draft.date || new Date().toISOString().split('T')[0],
      dueDate: draft.dueDate || this.calculateDueDate(30),
      status: 'draft',
      currency: draft.currency || appSettings.defaultCurrency,
      taxRate,
      from: draft.from || {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
      },
      to: draft.to || { name: '', email: '', phone: '', address: '' },
      items,
      discount,
      ...totals,
      visibility: draft.visibility,
      metadata: draft.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (invoice.to.clientId) {
      await this.clientRepo.updateLastUsed(invoice.to.clientId);
    }
    await this.settingsRepo.incrementInvoiceNumber();
    eventBus.emit('invoice:created', invoice);
    return this.invoiceRepo.create(invoice);
  }

  async duplicateInvoice(id: string): Promise<Invoice> {
    const original = await this.invoiceRepo.getById(id);
    if (!original) throw new Error('Invoice not found');
    return this.createInvoice({
      ...original,
      id: undefined,
      invoiceNumber: undefined,
      date: new Date().toISOString().split('T')[0],
      dueDate: this.calculateDueDate(30),
      status: 'draft',
    });
  }

  async markAsPaid(id: string): Promise<Invoice> {
    const updated = await this.invoiceRepo.update(id, {
      status: 'paid',
      updatedAt: new Date().toISOString(),
    });
    eventBus.emit('invoice:paid', updated);
    return updated;
  }

  async markAsSent(id: string): Promise<Invoice> {
    return this.invoiceRepo.update(id, {
      status: 'sent',
      updatedAt: new Date().toISOString(),
    });
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepo.getAll();
    const today = new Date().toISOString().split('T')[0];
    return invoices.filter((inv) => inv.status !== 'paid' && inv.dueDate < today);
  }

  generateInvoiceNumber(appSettings: AppSettings): string {
    return `${appSettings.invoiceNumberPrefix}${appSettings.nextInvoiceNumber.toString().padStart(3, '0')}`;
  }

  calculateDueDate(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }
}
