import type { CompanySettings, AppSettings } from '../../types/settings';

export interface ISettingsRepository {
  get(userId?: string): Promise<CompanySettings>;
  getAppSettings(): Promise<AppSettings>;
  update(updates: Partial<CompanySettings>, userId?: string): Promise<CompanySettings>;
  incrementInvoiceNumber(userId?: string): Promise<void>;
}
