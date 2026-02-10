import type { CurrencyCode } from './currency';
import type { PaymentMethod } from './payment';

// Re-export for backwards compatibility
export type { PaymentType, BankTransferDetails as BankDetails } from './payment';

export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

export interface CompanySettings {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  businessId: string;
  paymentMethods: PaymentMethod[];
  lastUsedClientId?: string;
}

export interface AppSettings {
  // Preferences
  dateFormat: DateFormat;
  weekStartsOn: 'sunday' | 'monday';
  autoSave: boolean;
  showDueDateWarnings: boolean;
  // Invoice defaults
  defaultTaxRate: number;
  defaultCurrency: CurrencyCode;
  invoiceNumberPrefix: string;
  nextInvoiceNumber: number;
}
