import { useCallback } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { formatCurrency } from '../utils/currency';
import type { CurrencyCode } from '../types/currency';

export const useCurrency = () => {
  const defaultCurrency = useSettingsStore((s) => s.appSettings.defaultCurrency);

  const format = useCallback(
    (cents: number, code?: CurrencyCode) => formatCurrency(cents, code || defaultCurrency),
    [defaultCurrency]
  );

  return { format, defaultCurrency };
};
