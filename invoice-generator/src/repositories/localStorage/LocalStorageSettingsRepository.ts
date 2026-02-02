import type { ISettingsRepository } from '../interfaces/SettingsRepository';
import type { CompanySettings } from '../../types/settings';
import { useSettingsStore } from '../../stores/useSettingsStore';

export class LocalStorageSettingsRepository implements ISettingsRepository {
  async get(_userId?: string): Promise<CompanySettings> {
    return useSettingsStore.getState().settings;
  }

  async update(updates: Partial<CompanySettings>, _userId?: string): Promise<CompanySettings> {
    useSettingsStore.getState().updateSettings(updates);
    return useSettingsStore.getState().settings;
  }

  async incrementInvoiceNumber(_userId?: string): Promise<void> {
    useSettingsStore.getState().incrementInvoiceNumber();
  }
}
