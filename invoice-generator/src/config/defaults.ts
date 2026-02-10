import type { CompanySettings } from '../types/settings';

export const DEFAULT_SETTINGS: CompanySettings = {
  name: '',
  email: '',
  phone: '',
  address: '',
  businessId: '',
  paymentType: 'bank_transfer',
  bankDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    swiftBic: '',
    iban: '',
  },
  defaultTaxRate: 0,
  defaultCurrency: 'USD',
  invoiceNumberPrefix: 'INV-',
  nextInvoiceNumber: 1,
  lastUsedClientId: undefined,
};
