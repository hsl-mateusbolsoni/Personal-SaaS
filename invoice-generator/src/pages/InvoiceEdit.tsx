import { Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useToast } from '@chakra-ui/react';
import { calculateInvoiceTotals } from '../utils/currency';
import { ROUTES } from '../config/routes';
import type { Invoice } from '../types/invoice';

export const InvoiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const invoice = useInvoiceStore((s) => s.invoices.find((i) => i.id === id));
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

  if (!invoice) {
    return (
      <Container>
        <Text>Invoice not found.</Text>
      </Container>
    );
  }

  const handleSubmit = (draft: Partial<Invoice>) => {
    const totals = calculateInvoiceTotals(draft.items || [], draft.taxRate || 0, draft.discount || null);
    updateInvoice(invoice.id, { ...draft, ...totals });
    toast({ title: 'Invoice updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    navigate(ROUTES.INVOICE_PREVIEW(invoice.id));
  };

  const handleAutoSave = (draft: Partial<Invoice>) => {
    const totals = calculateInvoiceTotals(draft.items || [], draft.taxRate || 0, draft.discount || null);
    updateInvoice(invoice.id, { ...draft, ...totals });
  };

  return (
    <Container>
      <Text fontSize="md" fontWeight="700" mb={6}>Edit Invoice</Text>
      <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="gray.200">
        <InvoiceForm
          initial={invoice}
          onSubmit={handleSubmit}
          onAutoSave={handleAutoSave}
          submitLabel="Save Changes"
        />
      </Box>
    </Container>
  );
};
