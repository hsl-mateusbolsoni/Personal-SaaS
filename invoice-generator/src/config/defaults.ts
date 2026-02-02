import type { CompanySettings } from '../types/settings';

export const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  email: '',
  phone: '',
  address: '',
  defaultTaxRate: 0,
  defaultCurrency: 'USD',
  invoiceNumberPrefix: 'INV-',
  nextInvoiceNumber: 1,
};
