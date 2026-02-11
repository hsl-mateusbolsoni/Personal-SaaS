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
import { useSyncStore } from '../stores/useSyncStore';
import type { Client } from '../types/client';
import type { Invoice } from '../types/invoice';
import type { CompanySettings, AppSettings } from '../types/settings';
import type { ActivityLog } from '../types/activity';

// Cache user ID to avoid repeated auth calls
let cachedUserId: string | null = null;
let userIdPromise: Promise<string | null> | null = null;

async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;

  // Return cached value if available
  if (cachedUserId !== null) return cachedUserId;

  // Deduplicate concurrent requests
  if (userIdPromise) return userIdPromise;

  userIdPromise = supabase.auth.getUser().then(({ data }) => {
    cachedUserId = data.user?.id ?? null;
    userIdPromise = null;
    return cachedUserId;
  });

  return userIdPromise;
}

// Clear cached user ID on auth state change
if (supabase) {
  supabase.auth.onAuthStateChange(() => {
    cachedUserId = null;
    userIdPromise = null;
  });
}

// Helper to wrap sync operations with error handling
async function withSyncTracking<T>(
  operation: () => Promise<T>,
  errorInfo: { type: 'client' | 'invoice' | 'settings' | 'activity'; operation: 'create' | 'update' | 'delete'; entityId?: string }
): Promise<T | null> {
  const { setSyncing, addError, setLastSyncAt } = useSyncStore.getState();

  setSyncing(true);
  try {
    const result = await operation();
    setLastSyncAt(new Date().toISOString());
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    addError({
      type: errorInfo.type,
      operation: errorInfo.operation,
      message,
      entityId: errorInfo.entityId,
    });
    console.error(`Sync error (${errorInfo.type} ${errorInfo.operation}):`, error);
    return null;
  } finally {
    setSyncing(false);
  }
}

export async function syncClientOnChange(client: Client): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncClient(client, userId),
      { type: 'client', operation: 'update', entityId: client.id }
    );
  }
}

export async function syncClientOnDelete(clientId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => deleteClientFromCloud(clientId),
      { type: 'client', operation: 'delete', entityId: clientId }
    );
  }
}

export async function syncInvoiceOnChange(invoice: Invoice): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncInvoice(invoice, userId),
      { type: 'invoice', operation: 'update', entityId: invoice.id }
    );
  }
}

export async function syncInvoiceOnDelete(invoiceId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => deleteInvoiceFromCloud(invoiceId),
      { type: 'invoice', operation: 'delete', entityId: invoiceId }
    );
  }
}

export async function syncCompanySettingsOnChange(settings: CompanySettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncCompanySettings(settings, userId),
      { type: 'settings', operation: 'update' }
    );
  }
}

export async function syncAppSettingsOnChange(settings: AppSettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncAppSettings(settings, userId),
      { type: 'settings', operation: 'update' }
    );
  }
}

export async function syncActivityOnChange(activity: ActivityLog): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncActivity(activity, userId),
      { type: 'activity', operation: 'create', entityId: activity.id }
    );
  }
}
