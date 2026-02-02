import type { CurrencyCode } from './currency';

export interface CompanySettings {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  defaultTaxRate: number;
  defaultCurrency: CurrencyCode;
  invoiceNumberPrefix: string;
  nextInvoiceNumber: number;
}
