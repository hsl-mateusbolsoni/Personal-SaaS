import { Flex, Text, Button, HStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { InvoicePreviewComponent } from '../components/invoice/InvoicePreview';
import { downloadInvoicePDF } from '../components/invoice/InvoicePDF';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useInvoiceActions } from '../hooks/useInvoiceActions';
import { ROUTES } from '../config/routes';

export const InvoicePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoice = useInvoiceStore((s) => s.invoices.find((i) => i.id === id));
  const { markPaid, markSent } = useInvoiceActions();

  if (!invoice) {
    return (
      <Container>
        <Text>Invoice not found.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={2}>
        <Button variant="ghost" size="xs" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Back
        </Button>
        <HStack gap={2}>
          {invoice.status === 'draft' && (
            <Button size="xs" variant="outline" onClick={() => markSent(invoice.id)}>
              Mark Sent
            </Button>
          )}
          {invoice.status !== 'paid' && (
            <Button size="xs" variant="outline" onClick={() => markPaid(invoice.id)}>
              Mark Paid
            </Button>
          )}
          <Button size="xs" variant="outline" onClick={() => navigate(ROUTES.INVOICE_EDIT(invoice.id))}>
            Edit
          </Button>
          <Button size="xs" onClick={() => downloadInvoicePDF(invoice)}>
            Download PDF
          </Button>
        </HStack>
      </Flex>
      <InvoicePreviewComponent invoice={invoice} />
    </Container>
  );
};
