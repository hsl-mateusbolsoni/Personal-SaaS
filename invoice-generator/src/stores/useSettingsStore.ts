import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanySettings, AppSettings } from '../types/settings';
import type { PaymentMethod } from '../types/payment';
import { DEFAULT_SETTINGS, DEFAULT_APP_SETTINGS } from '../config/defaults';

interface SettingsStore {
  settings: CompanySettings;
  appSettings: AppSettings;
  isFirstTime: boolean;
  updateSettings: (updates: Partial<CompanySettings>) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  incrementInvoiceNumber: () => void;
  markSetupComplete: () => void;
  setLastUsedClient: (clientId: string | undefined) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      appSettings: DEFAULT_APP_SETTINGS,
      isFirstTime: true,

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),

      updateAppSettings: (updates) => set((state) => ({
        appSettings: { ...state.appSettings, ...updates },
      })),

      addPaymentMethod: (method) => set((state) => {
        const isFirst = state.settings.paymentMethods.length === 0;
        return {
          settings: {
            ...state.settings,
            paymentMethods: [
              ...state.settings.paymentMethods,
              { ...method, isDefault: isFirst ? true : method.isDefault },
            ],
          },
        };
      }),

      updatePaymentMethod: (id, updates) => set((state) => ({
        settings: {
          ...state.settings,
          paymentMethods: state.settings.paymentMethods.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        },
      })),

      removePaymentMethod: (id) => set((state) => {
        const filtered = state.settings.paymentMethods.filter((m) => m.id !== id);
        // If we removed the default, make the first one default
        if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
          filtered[0].isDefault = true;
        }
        return {
          settings: {
            ...state.settings,
            paymentMethods: filtered,
          },
        };
      }),

      setDefaultPaymentMethod: (id) => set((state) => ({
        settings: {
          ...state.settings,
          paymentMethods: state.settings.paymentMethods.map((m) => ({
            ...m,
            isDefault: m.id === id,
          })),
        },
      })),

      incrementInvoiceNumber: () => set((state) => ({
        appSettings: {
          ...state.appSettings,
          nextInvoiceNumber: state.appSettings.nextInvoiceNumber + 1,
        },
      })),

      markSetupComplete: () => set({ isFirstTime: false }),

      setLastUsedClient: (clientId) => set((state) => ({
        settings: { ...state.settings, lastUsedClientId: clientId },
      })),
    }),
    {
      name: 'invoice-generator-v1:settings',
      version: 3,
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>;

        if (version < 3) {
          // Migrate from v2 (single payment type/bankDetails) to v3 (paymentMethods array)
          const oldSettings = state.settings as Record<string, unknown> || {};
          const paymentMethods: PaymentMethod[] = [];

          // Migrate existing bank details if present
          if (oldSettings.bankDetails && typeof oldSettings.bankDetails === 'object') {
            const bankDetails = oldSettings.bankDetails as Record<string, string>;
            if (bankDetails.bankName || bankDetails.accountNumber || bankDetails.iban) {
              paymentMethods.push({
                id: crypto.randomUUID(),
                type: 'bank_transfer',
                isDefault: true,
                bankTransfer: {
                  bankName: bankDetails.bankName || '',
                  accountName: bankDetails.accountName || '',
                  accountNumber: bankDetails.accountNumber || '',
                  routingNumber: bankDetails.routingNumber || '',
                  swiftBic: bankDetails.swiftBic || '',
                  iban: bankDetails.iban || '',
                },
              });
            }
          }

          // Move invoice defaults to appSettings
          const appSettings = {
            ...DEFAULT_APP_SETTINGS,
            ...(state.appSettings as Record<string, unknown> || {}),
            defaultTaxRate: (oldSettings.defaultTaxRate as number) ?? DEFAULT_APP_SETTINGS.defaultTaxRate,
            defaultCurrency: (oldSettings.defaultCurrency as string) ?? DEFAULT_APP_SETTINGS.defaultCurrency,
            invoiceNumberPrefix: (oldSettings.invoiceNumberPrefix as string) ?? DEFAULT_APP_SETTINGS.invoiceNumberPrefix,
            nextInvoiceNumber: (oldSettings.nextInvoiceNumber as number) ?? DEFAULT_APP_SETTINGS.nextInvoiceNumber,
          };

          return {
            ...state,
            settings: {
              name: oldSettings.name || '',
              email: oldSettings.email || '',
              phone: oldSettings.phone || '',
              address: oldSettings.address || '',
              businessId: oldSettings.businessId || '',
              paymentMethods,
              lastUsedClientId: oldSettings.lastUsedClientId,
            },
            appSettings,
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
            paymentMethods: persisted?.settings?.paymentMethods || [],
          },
          appSettings: {
            ...DEFAULT_APP_SETTINGS,
            ...persisted?.appSettings,
          },
        };
      },
    }
  )
);
