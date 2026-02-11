import { create } from 'zustand';

export interface SyncError {
  id: string;
  type: 'client' | 'invoice' | 'settings' | 'activity';
  operation: 'create' | 'update' | 'delete';
  message: string;
  timestamp: string;
  entityId?: string;
}

interface SyncStore {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  errors: SyncError[];
  pendingChanges: number;

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncAt: (timestamp: string) => void;
  addError: (error: Omit<SyncError, 'id' | 'timestamp'>) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  incrementPending: () => void;
  decrementPending: () => void;
  resetPending: () => void;
}

export const useSyncStore = create<SyncStore>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncAt: null,
  errors: [],
  pendingChanges: 0,

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
      ].slice(-10), // Keep only last 10 errors
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
}));

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useSyncStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useSyncStore.getState().setOnline(false);
  });
}
