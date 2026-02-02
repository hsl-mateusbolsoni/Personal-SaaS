import { invoiceRepository, clientRepository, settingsRepository } from '../repositories';

export const useRepository = () => ({
  invoices: invoiceRepository,
  clients: clientRepository,
  settings: settingsRepository,
});
