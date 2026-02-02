import { Box, Text } from '@chakra-ui/react';
import { Container } from '../components/layout/Container';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { useInvoiceActions } from '../hooks/useInvoiceActions';
import type { Invoice } from '../types/invoice';

export const InvoiceCreate = () => {
  const { create } = useInvoiceActions();

  return (
    <Container>
      <Text fontSize="md" fontWeight="700" mb={6}>New Invoice</Text>
      <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="gray.200">
        <InvoiceForm onSubmit={(draft) => create(draft)} submitLabel="Create Invoice" />
      </Box>
    </Container>
  );
};
