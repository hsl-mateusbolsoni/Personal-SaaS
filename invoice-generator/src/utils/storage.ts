const STORAGE_PREFIX = 'invoice-generator-v1';

export const storageKeys = {
  invoices: `${STORAGE_PREFIX}:invoices`,
  clients: `${STORAGE_PREFIX}:clients`,
  settings: `${STORAGE_PREFIX}:settings`,
} as const;
