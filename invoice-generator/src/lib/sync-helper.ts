import { supabase } from './supabase';
import {
  syncClient,
  syncInvoice,
  syncCompanySettings,
  syncAppSettings,
  syncActivity,
  deleteClientFromCloud,
  deleteInvoiceFromCloud,
} from './supabase-sync';
import type { Client } from '../types/client';
import type { Invoice } from '../types/invoice';
import type { CompanySettings, AppSettings } from '../types/settings';
import type { ActivityLog } from '../types/activity';

async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function syncClientOnChange(client: Client): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await syncClient(client, userId);
  }
}

export async function syncClientOnDelete(clientId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await deleteClientFromCloud(clientId);
  }
}

export async function syncInvoiceOnChange(invoice: Invoice): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await syncInvoice(invoice, userId);
  }
}

export async function syncInvoiceOnDelete(invoiceId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await deleteInvoiceFromCloud(invoiceId);
  }
}

export async function syncCompanySettingsOnChange(settings: CompanySettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await syncCompanySettings(settings, userId);
  }
}

export async function syncAppSettingsOnChange(settings: AppSettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await syncAppSettings(settings, userId);
  }
}

export async function syncActivityOnChange(activity: ActivityLog): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await syncActivity(activity, userId);
  }
}
