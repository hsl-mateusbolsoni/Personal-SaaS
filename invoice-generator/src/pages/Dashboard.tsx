import { Box, Flex, Text, SimpleGrid, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'phosphor-react';
import { Container } from '../components/layout/Container';
import { InvoiceList } from '../components/invoice/InvoiceList';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useCurrency } from '../hooks/useCurrency';
import { ROUTES } from '../config/routes';

export const Dashboard = () => {
  const navigate = useNavigate();
  const invoices = useInvoiceStore((s) => s.invoices);
  const { format } = useCurrency();

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.totalCents, 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalCents, 0);
  const overdueCount = invoices.filter(
    (i) => i.status !== 'paid' && i.dueDate < new Date().toISOString().split('T')[0]
  ).length;

  return (
    <Container>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="md" fontWeight="700">Invoices</Text>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate(ROUTES.INVOICE_CREATE)}>
          New Invoice
        </Button>
      </Flex>

      {invoices.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
          <StatCard label="Outstanding" value={format(totalOutstanding)} />
          <StatCard label="Paid" value={format(totalPaid)} />
          <StatCard label="Overdue" value={String(overdueCount)} highlight={overdueCount > 0} />
        </SimpleGrid>
      )}

      <InvoiceList />
    </Container>
  );
};

const StatCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <Box bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
    <Text fontSize="xs" color="gray.500" mb={1}>{label}</Text>
    <Text fontSize="md" fontWeight="700" color={highlight ? 'red.500' : 'gray.800'}>{value}</Text>
  </Box>
);
