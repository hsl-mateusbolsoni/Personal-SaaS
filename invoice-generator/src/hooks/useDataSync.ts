import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClientStore } from '../stores/useClientStore';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useActivityStore } from '../stores/useActivityStore';
import {
  fetchClients,
  fetchInvoices,
  fetchCompanySettings,
  fetchAppSettings,
  fetchActivities,
  migrateLocalDataToCloud,
} from '../lib/supabase-sync';

export function useDataSync() {
  const { user, session } = useAuth();
  const previousUserId = useRef<string | null>(null);
  const isSyncing = useRef(false);

  const clientStore = useClientStore();
  const invoiceStore = useInvoiceStore();
  const settingsStore = useSettingsStore();
  const activityStore = useActivityStore();

  useEffect(() => {
    const userId = user?.id ?? null;

    // Skip if no change in user
    if (previousUserId.current === userId) return;

    const wasLoggedIn = previousUserId.current !== null;
    const isNowLoggedIn = userId !== null;

    previousUserId.current = userId;

    // User logged out - clear local data
    if (wasLoggedIn && !isNowLoggedIn) {
      console.log('User logged out, clearing local data...');
      // Optionally clear stores here, or keep local data
      return;
    }

    // User logged in - sync data
    if (isNowLoggedIn && session) {
      syncData(userId);
    }
  }, [user, session]);

  async function syncData(userId: string) {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      console.log('Syncing data for user:', userId);

      // Fetch cloud data
      const [cloudClients, cloudInvoices, cloudCompanySettings, cloudAppSettings, cloudActivities] =
        await Promise.all([
          fetchClients(),
          fetchInvoices(),
          fetchCompanySettings(),
          fetchAppSettings(),
          fetchActivities(),
        ]);

      // Check if user has cloud data
      const hasCloudData =
        cloudClients.length > 0 ||
        cloudInvoices.length > 0 ||
        cloudCompanySettings !== null;

      // Check if user has local data
      const localClients = clientStore.clients;
      const localInvoices = invoiceStore.invoices;
      const localCompanySettings = settingsStore.settings;
      const localAppSettings = settingsStore.appSettings;
      const localActivities = activityStore.activities;

      const hasLocalData =
        localClients.length > 0 ||
        localInvoices.length > 0 ||
        localCompanySettings.name !== '';

      if (hasCloudData) {
        // User has cloud data - load it into local stores
        console.log('Loading cloud data into local stores...');

        // Replace local data with cloud data
        useClientStore.setState({ clients: cloudClients });
        useInvoiceStore.setState({ invoices: cloudInvoices });

        if (cloudCompanySettings) {
          useSettingsStore.setState((state) => ({
            settings: { ...state.settings, ...cloudCompanySettings },
            isFirstTime: false, // User has already set up their account
          }));
        }

        if (cloudAppSettings) {
          useSettingsStore.setState((state) => ({
            appSettings: { ...state.appSettings, ...cloudAppSettings },
          }));
        }

        if (cloudActivities.length > 0) {
          useActivityStore.setState({ activities: cloudActivities });
        }

        console.log('Cloud data loaded successfully');
      } else if (hasLocalData) {
        // User has no cloud data but has local data - migrate to cloud
        console.log('Migrating local data to cloud...');

        await migrateLocalDataToCloud(
          userId,
          localClients,
          localInvoices,
          localCompanySettings,
          localAppSettings,
          localActivities
        );

        console.log('Local data migrated to cloud');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      isSyncing.current = false;
    }
  }
}
