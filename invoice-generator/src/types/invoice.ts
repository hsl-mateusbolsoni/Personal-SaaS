import type { CurrencyCode } from './currency';

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rateCents: number;
  amountCents: number;
}

export interface Invoice {
  id: string;
  userId?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  from: CompanyInfo;
  to: ClientInfo & { clientId?: string };
  items: LineItem[];
  currency: CurrencyCode;
  subtotalCents: number;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  } | null;
  discountAmountCents: number;
  taxRate: number;
  taxAmountCents: number;
  totalCents: number;
  metadata?: {
    tags?: string[];
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}
