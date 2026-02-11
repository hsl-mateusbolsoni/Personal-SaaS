import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SyncError {
  id: string;
  type: 'client' | 'invoice' | 'settings' | 'activity';
  operation: 'create' | 'update' | 'delete';
  message: string;
  timestamp: string;
  entityId?: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'client' | 'invoice' | 'settings' | 'activity';
  operation: 'upsert' | 'delete';
  entityId?: string;
  payload: unknown;
  userId: string;
  retryCount: number;
  createdAt: string;
}

interface SyncStore {
  // Transient state (not persisted)
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  errors: SyncError[];
  pendingChanges: number;

  // Persisted queue
  queue: SyncQueueItem[];

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncAt: (timestamp: string) => void;
  addError: (error: Omit<SyncError, 'id' | 'timestamp'>) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  incrementPending: () => void;
  decrementPending: () => void;
  resetPending: () => void;

  enqueue: (item: Omit<SyncQueueItem, 'id' | 'retryCount' | 'createdAt'>) => void;
  dequeue: (id: string) => void;
  incrementRetry: (id: string) => void;
}

const MAX_RETRIES = 5;

export const useSyncStore = create<SyncStore>()(
  persist(
    (set) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: false,
      lastSyncAt: null,
      errors: [],
      pendingChanges: 0,
      queue: [],

      setOnline: (online) => set({ isOnline: online }),
      setSyncing: (syncing) => set({ isSyncing: syncing }),
      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),

      addError: (error) =>
        set((state) => ({
          errors: [
            ...state.errors,
            {
              ...error,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
          ].slice(-10),
        })),

      clearError: (id) =>
        set((state) => ({
          errors: state.errors.filter((e) => e.id !== id),
        })),

      clearAllErrors: () => set({ errors: [] }),

      incrementPending: () =>
        set((state) => ({ pendingChanges: state.pendingChanges + 1 })),

      decrementPending: () =>
        set((state) => ({ pendingChanges: Math.max(0, state.pendingChanges - 1) })),

      resetPending: () => set({ pendingChanges: 0 }),

      enqueue: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...item,
              id: crypto.randomUUID(),
              retryCount: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      dequeue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),

      incrementRetry: (id) =>
        set((state) => ({
          queue: state.queue
            .map((item) =>
              item.id === id ? { ...item, retryCount: item.retryCount + 1 } : item
            )
            .filter((item) => item.retryCount <= MAX_RETRIES),
        })),
    }),
    {
      name: 'invoice-generator-v1:sync-queue',
      partialize: (state) => ({ queue: state.queue }),
    }
  )
);

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useSyncStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useSyncStore.getState().setOnline(false);
  });
}
