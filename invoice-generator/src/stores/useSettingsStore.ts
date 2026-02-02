import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanySettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../config/defaults';

interface SettingsStore {
  settings: CompanySettings;
  isFirstTime: boolean;
  updateSettings: (updates: Partial<CompanySettings>) => void;
  incrementInvoiceNumber: () => void;
  markSetupComplete: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isFirstTime: true,
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),
      incrementInvoiceNumber: () => set((state) => ({
        settings: { ...state.settings, nextInvoiceNumber: state.settings.nextInvoiceNumber + 1 },
      })),
      markSetupComplete: () => set({ isFirstTime: false }),
    }),
    { name: 'invoice-generator-v1:settings', version: 1 }
  )
);
