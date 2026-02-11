import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityLog, ActivityType } from '../types/activity';
import { syncActivityOnChange } from '../lib/sync-helper';

interface ActivityStore {
  activities: ActivityLog[];
  addActivity: (invoiceId: string, type: ActivityType, description?: string, metadata?: Record<string, unknown>) => void;
  getActivitiesForInvoice: (invoiceId: string) => ActivityLog[];
  deleteActivitiesForInvoice: (invoiceId: string) => void;
}

const generateId = () => `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (invoiceId, type, description, metadata) => {
        const activity: ActivityLog = {
          id: generateId(),
          invoiceId,
          type,
          description: description || '',
          metadata,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          activities: [activity, ...state.activities],
        }));
        syncActivityOnChange(activity);
      },

      getActivitiesForInvoice: (invoiceId) => {
        return get().activities
          .filter((a) => a.invoiceId === invoiceId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      deleteActivitiesForInvoice: (invoiceId) => {
        set((state) => ({
          activities: state.activities.filter((a) => a.invoiceId !== invoiceId),
        }));
      },
    }),
    { name: 'invoice-generator-v1:activities', version: 1 }
  )
);
