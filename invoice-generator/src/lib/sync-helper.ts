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
import type { SyncQueueItem } from '../stores/useSyncStore';
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

// Helper to wrap sync operations with error handling and queue fallback
async function withSyncTracking<T>(
  operation: () => Promise<T>,
  errorInfo: { type: 'client' | 'invoice' | 'settings' | 'activity'; operation: 'create' | 'update' | 'delete'; entityId?: string },
  queueData?: { type: SyncQueueItem['type']; operation: SyncQueueItem['operation']; entityId?: string; payload: unknown; userId: string }
): Promise<T | null> {
  const { setSyncing, addError, setLastSyncAt } = useSyncStore.getState();

  setSyncing(true);
  try {
    const result = await operation();
    setLastSyncAt(new Date().toISOString());
    // Opportunistically flush queue after successful sync
    scheduleFlush();
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

    // Enqueue for retry
    if (queueData) {
      useSyncStore.getState().enqueue(queueData);
    }
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
      { type: 'client', operation: 'update', entityId: client.id },
      { type: 'client', operation: 'upsert', entityId: client.id, payload: client, userId }
    );
  }
}

export async function syncClientOnDelete(clientId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => deleteClientFromCloud(clientId),
      { type: 'client', operation: 'delete', entityId: clientId },
      { type: 'client', operation: 'delete', entityId: clientId, payload: null, userId }
    );
  }
}

export async function syncInvoiceOnChange(invoice: Invoice): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncInvoice(invoice, userId),
      { type: 'invoice', operation: 'update', entityId: invoice.id },
      { type: 'invoice', operation: 'upsert', entityId: invoice.id, payload: invoice, userId }
    );
  }
}

export async function syncInvoiceOnDelete(invoiceId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => deleteInvoiceFromCloud(invoiceId),
      { type: 'invoice', operation: 'delete', entityId: invoiceId },
      { type: 'invoice', operation: 'delete', entityId: invoiceId, payload: null, userId }
    );
  }
}

export async function syncCompanySettingsOnChange(settings: CompanySettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncCompanySettings(settings, userId),
      { type: 'settings', operation: 'update' },
      { type: 'settings', operation: 'upsert', payload: { kind: 'company', data: settings }, userId }
    );
  }
}

export async function syncAppSettingsOnChange(settings: AppSettings): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncAppSettings(settings, userId),
      { type: 'settings', operation: 'update' },
      { type: 'settings', operation: 'upsert', payload: { kind: 'app', data: settings }, userId }
    );
  }
}

export async function syncActivityOnChange(activity: ActivityLog): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    await withSyncTracking(
      () => syncActivity(activity, userId),
      { type: 'activity', operation: 'create', entityId: activity.id },
      { type: 'activity', operation: 'upsert', entityId: activity.id, payload: activity, userId }
    );
  }
}

// ============================================
// SYNC QUEUE FLUSH
// ============================================

let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushSyncQueue();
  }, 2000);
}

async function replayQueueItem(item: SyncQueueItem): Promise<void> {
  const { type, operation, entityId, payload, userId } = item;

  if (operation === 'delete') {
    if (type === 'client' && entityId) {
      await deleteClientFromCloud(entityId);
    } else if (type === 'invoice' && entityId) {
      await deleteInvoiceFromCloud(entityId);
    }
    return;
  }

  // operation === 'upsert'
  switch (type) {
    case 'client':
      await syncClient(payload as Client, userId);
      break;
    case 'invoice':
      await syncInvoice(payload as Invoice, userId);
      break;
    case 'settings': {
      const settingsPayload = payload as { kind: string; data: unknown };
      if (settingsPayload.kind === 'company') {
        await syncCompanySettings(settingsPayload.data as CompanySettings, userId);
      } else {
        await syncAppSettings(settingsPayload.data as AppSettings, userId);
      }
      break;
    }
    case 'activity':
      await syncActivity(payload as ActivityLog, userId);
      break;
  }
}

export async function flushSyncQueue(): Promise<void> {
  if (isFlushing) return;
  if (!useSyncStore.getState().isOnline) return;

  const { queue } = useSyncStore.getState();
  if (queue.length === 0) return;

  isFlushing = true;

  // Process oldest first
  const sorted = [...queue].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (const item of sorted) {
    try {
      await replayQueueItem(item);
      useSyncStore.getState().dequeue(item.id);
      useSyncStore.getState().setLastSyncAt(new Date().toISOString());
    } catch {
      useSyncStore.getState().incrementRetry(item.id);
    }
  }

  isFlushing = false;
}

// Flush queue when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    scheduleFlush();
  });
}
