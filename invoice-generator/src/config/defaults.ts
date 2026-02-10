import type { CompanySettings, AppSettings } from '../types/settings';

export const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  email: '',
  phone: '',
  address: '',
  businessId: '',
  paymentMethods: [],
  lastUsedClientId: undefined,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  dateFormat: 'MM/DD/YYYY',
  weekStartsOn: 'sunday',
  autoSave: true,
  showDueDateWarnings: true,
  defaultTaxRate: 0,
  defaultCurrency: 'USD',
  invoiceNumberPrefix: 'INV-',
  nextInvoiceNumber: 1,
};
