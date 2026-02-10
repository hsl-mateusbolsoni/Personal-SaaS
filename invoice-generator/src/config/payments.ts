import type { PaymentType } from '../types/settings';

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  bank_transfer: 'Bank Transfer',
  pix: 'PIX',
  paypal: 'PayPal',
  wise: 'Wise',
  crypto: 'Cryptocurrency',
  other: 'Other',
};

export const PAYMENT_TYPES = Object.keys(PAYMENT_TYPE_LABELS) as PaymentType[];
