import { LocalStorageInvoiceRepository } from './localStorage/LocalStorageInvoiceRepository';
import { LocalStorageClientRepository } from './localStorage/LocalStorageClientRepository';
import { LocalStorageSettingsRepository } from './localStorage/LocalStorageSettingsRepository';
import type { IInvoiceRepository } from './interfaces/InvoiceRepository';
import type { IClientRepository } from './interfaces/ClientRepository';
import type { ISettingsRepository } from './interfaces/SettingsRepository';

export const invoiceRepository: IInvoiceRepository = new LocalStorageInvoiceRepository();
export const clientRepository: IClientRepository = new LocalStorageClientRepository();
export const settingsRepository: ISettingsRepository = new LocalStorageSettingsRepository();
