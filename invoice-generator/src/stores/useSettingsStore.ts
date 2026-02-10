import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanySettings, BankDetails } from '../types/settings';
import { DEFAULT_SETTINGS } from '../config/defaults';

interface SettingsStore {
  settings: CompanySettings;
  isFirstTime: boolean;
  updateSettings: (updates: Partial<CompanySettings>) => void;
  incrementInvoiceNumber: () => void;
  markSetupComplete: () => void;
  setLastUsedClient: (clientId: string | undefined) => void;
}

const DEFAULT_BANK_DETAILS: BankDetails = {
  bankName: '',
  accountName: '',
  accountNumber: '',
  routingNumber: '',
  swiftBic: '',
  iban: '',
};

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
      setLastUsedClient: (clientId) => set((state) => ({
        settings: { ...state.settings, lastUsedClientId: clientId },
      })),
    }),
    {
      name: 'invoice-generator-v1:settings',
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as SettingsStore;

        if (version < 2) {
          // Migrate bankDetails from string to object
          const settings = state.settings || DEFAULT_SETTINGS;
          return {
            ...state,
            settings: {
              ...settings,
              businessId: settings.businessId || '',
              bankDetails: typeof settings.bankDetails === 'object' && settings.bankDetails !== null
                ? { ...DEFAULT_BANK_DETAILS, ...settings.bankDetails }
                : DEFAULT_BANK_DETAILS,
            },
          };
        }

        return state;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as SettingsStore;
        return {
          ...currentState,
          ...persisted,
          settings: {
            ...DEFAULT_SETTINGS,
            ...persisted?.settings,
            bankDetails: {
              ...DEFAULT_BANK_DETAILS,
              ...(typeof persisted?.settings?.bankDetails === 'object' ? persisted.settings.bankDetails : {}),
            },
          },
        };
      },
    }
  )
);
