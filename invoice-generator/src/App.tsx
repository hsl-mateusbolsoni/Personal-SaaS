import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { InvoiceCreate } from './pages/InvoiceCreate';
import { InvoiceEdit } from './pages/InvoiceEdit';
import { InvoicePreviewPage } from './pages/InvoicePreview';
import { Clients } from './pages/Clients';
import { BusinessDetails } from './pages/BusinessDetails';
import { Settings } from './pages/Settings';
import { useSettingsStore } from './stores/useSettingsStore';

function App() {
  const isFirstTime = useSettingsStore((s) => s.isFirstTime);

  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={isFirstTime ? <Navigate to="/business" replace /> : <Dashboard />} />
            <Route path="/invoices/new" element={<InvoiceCreate />} />
            <Route path="/invoices/:id/edit" element={<InvoiceEdit />} />
            <Route path="/invoices/:id/preview" element={<InvoicePreviewPage />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/business" element={<BusinessDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
