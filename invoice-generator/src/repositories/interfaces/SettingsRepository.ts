import type { CompanySettings } from '../../types/settings';

export interface ISettingsRepository {
  get(userId?: string): Promise<CompanySettings>;
  update(updates: Partial<CompanySettings>, userId?: string): Promise<CompanySettings>;
  incrementInvoiceNumber(userId?: string): Promise<void>;
}
