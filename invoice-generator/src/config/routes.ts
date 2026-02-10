export const ROUTES = {
  DASHBOARD: '/',
  INVOICE_CREATE: '/invoices/new',
  INVOICE_EDIT: (id: string) => `/invoices/${id}/edit`,
  INVOICE_PREVIEW: (id: string) => `/invoices/${id}/preview`,
  CLIENTS: '/clients',
  BUSINESS: '/business',
  SETTINGS: '/settings',
} as const;
