import { InvoiceService } from './InvoiceService';
import { ClientService } from './ClientService';
import { invoiceRepository, clientRepository, settingsRepository } from '../repositories';

export const invoiceService = new InvoiceService(invoiceRepository, clientRepository, settingsRepository);
export const clientService = new ClientService(clientRepository);
