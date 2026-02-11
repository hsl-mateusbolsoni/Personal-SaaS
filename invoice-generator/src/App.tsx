import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useDataSync } from './hooks/useDataSync';
import { AppShell } from './components/layout/AppShell';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { InvoiceEditor } from './pages/InvoiceEditor';
import { InvoicePreviewPage } from './pages/InvoicePreview';
import { Clients } from './pages/Clients';
import { BusinessDetails } from './pages/BusinessDetails';
import { Settings } from './pages/Settings';
import { useSettingsStore } from './stores/useSettingsStore';

function DataSyncProvider({ children }: { children: React.ReactNode }) {
  useDataSync();
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const isFirstTime = useSettingsStore((s) => s.isFirstTime);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Flex h="100vh" justify="center" align="center" bg="brand.50">
        <Spinner size="xl" color="accent.500" thickness="3px" />
      </Flex>
    );
  }

  // Not authenticated - show auth page
  if (!user) {
    return <Auth />;
  }

  // Authenticated - show app
  return (
    <DataSyncProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={isFirstTime ? <Navigate to="/business" replace /> : <Dashboard />} />
          <Route path="/invoices/new" element={<InvoiceEditor />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEditor />} />
          <Route path="/invoices/:id/preview" element={<InvoicePreviewPage />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/business" element={<BusinessDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </DataSyncProvider>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
