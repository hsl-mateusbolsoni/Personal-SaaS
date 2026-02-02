import currency from 'currency.js';
import type { CurrencyCode } from '../types/currency';
import type { LineItem, Invoice } from '../types/invoice';
import { CURRENCY_CONFIGS } from '../config/currencies';

export const createCurrency = (value: number, decimals: number = 2) => {
  return currency(value, { precision: decimals, fromCents: true });
};

export const calculateLineItemAmount = (quantity: number, rateCents: number): number => {
  return createCurrency(rateCents).multiply(quantity).intValue;
};

export const calculateInvoiceTotals = (
  items: LineItem[],
  taxRate: number,
  discount: Invoice['discount']
) => {
  const subtotalCents = items.reduce((sum, item) => sum + item.amountCents, 0);

  let discountAmountCents = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmountCents = createCurrency(subtotalCents).multiply(discount.value / 100).intValue;
    } else {
      discountAmountCents = discount.value;
    }
  }

  const taxableAmountCents = subtotalCents - discountAmountCents;
  const taxAmountCents = createCurrency(taxableAmountCents).multiply(taxRate / 100).intValue;
  const totalCents = taxableAmountCents + taxAmountCents;

  return { subtotalCents, discountAmountCents, taxAmountCents, totalCents };
};

export const formatCurrency = (cents: number, currencyCode: CurrencyCode): string => {
  const config = CURRENCY_CONFIGS[currencyCode];
  const divisor = Math.pow(10, config.decimals);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(cents / divisor);
};
