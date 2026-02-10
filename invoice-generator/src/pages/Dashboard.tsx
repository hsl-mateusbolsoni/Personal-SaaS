import { Box, Text, SimpleGrid, Button, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Plus, Lightning } from 'phosphor-react';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { InvoiceList } from '../components/invoice/InvoiceList';
import { QuickInvoiceModal } from '../components/invoice/QuickInvoiceModal';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useClientStore } from '../stores/useClientStore';
import { useCurrency } from '../hooks/useCurrency';
import { ROUTES } from '../config/routes';

export const Dashboard = () => {
  const navigate = useNavigate();
  const invoices = useInvoiceStore((s) => s.invoices);
  const clients = useClientStore((s) => s.clients);
  const { format } = useCurrency();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.totalCents, 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalCents, 0);
  const overdueCount = invoices.filter(
    (i) => i.status !== 'paid' && i.dueDate < new Date().toISOString().split('T')[0]
  ).length;

  const hasClients = clients.length > 0;

  return (
    <Container>
      <PageHeader
        title="Invoices"
        subtitle="Manage and track all your invoices"
        actions={
          <>
            {hasClients && (
              <Button
                variant="outline"
                leftIcon={<Lightning size={14} weight="fill" />}
                onClick={onOpen}
              >
                Quick Invoice
              </Button>
            )}
            <Button leftIcon={<Plus size={14} weight="bold" />} onClick={() => navigate(ROUTES.INVOICE_CREATE)}>
              New Invoice
            </Button>
          </>
        }
      />

      {invoices.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
          <StatCard label="Outstanding" value={format(totalOutstanding)} />
          <StatCard label="Paid" value={format(totalPaid)} />
          <StatCard label="Overdue" value={String(overdueCount)} highlight={overdueCount > 0} />
        </SimpleGrid>
      )}

      <InvoiceList />

      <QuickInvoiceModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

const StatCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <Box bg="white" p={5} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
    <Text fontSize="xs" fontWeight="500" color="brand.400" textTransform="uppercase" mb={1}>
      {label}
    </Text>
    <Text fontSize="xl" fontWeight="700" color={highlight ? 'danger.500' : 'brand.800'}>
      {value}
    </Text>
  </Box>
);
