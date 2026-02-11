import type { AppSettings } from '../types/settings';

export function generateInvoiceNumber(appSettings: AppSettings): string {
  return `${appSettings.invoiceNumberPrefix}${appSettings.nextInvoiceNumber.toString().padStart(3, '0')}`;
}

export function calculateDueDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}
