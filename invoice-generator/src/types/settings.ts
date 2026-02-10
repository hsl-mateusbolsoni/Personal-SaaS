import type { CurrencyCode } from './currency';

export type PaymentType = 'bank_transfer' | 'pix' | 'paypal' | 'wise' | 'crypto' | 'other';

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  iban: string;
}

export interface CompanySettings {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  businessId: string;
  paymentType: PaymentType;
  bankDetails: BankDetails;
  defaultTaxRate: number;
  defaultCurrency: CurrencyCode;
  invoiceNumberPrefix: string;
  nextInvoiceNumber: number;
  lastUsedClientId?: string;
}
