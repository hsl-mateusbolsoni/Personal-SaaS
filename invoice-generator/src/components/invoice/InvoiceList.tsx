import { Box, Input, HStack, InputGroup, InputLeftElement, useDisclosure, useToken } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass } from 'phosphor-react';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useInvoiceActions } from '../../hooks/useInvoiceActions';
import { InvoiceCard } from './InvoiceCard';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { EmptyState } from '../ui/EmptyState';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ROUTES } from '../../config/routes';
import type { Invoice } from '../../types/invoice';

type StatusFilter = Invoice['status'] | 'all';

export const InvoiceList = () => {
  const invoices = useInvoiceStore((s) => s.invoices);
  const navigate = useNavigate();
  const { duplicate, markPaid, markSent, remove } = useInvoiceActions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { isOpen: isActivityOpen, onOpen: onActivityOpen, onClose: onActivityClose } = useDisclosure();
  const [iconColor] = useToken('colors', ['brand.400']);

  const statusCounts = useMemo(() => ({
    all: invoices.length,
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) => i.status === 'sent').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
  }), [invoices]);

  const filterOptions: Array<{ value: StatusFilter; label: string; count?: number }> = [
    { value: 'all', label: 'All', count: statusCounts.all },
    { value: 'draft', label: 'Draft', count: statusCounts.draft },
    { value: 'sent', label: 'Sent', count: statusCounts.sent },
    { value: 'paid', label: 'Paid', count: statusCounts.paid },
    { value: 'overdue', label: 'Overdue', count: statusCounts.overdue },
  ];

  const filtered = invoices
    .filter((inv) => statusFilter === 'all' || inv.status === statusFilter)
    .filter((inv) =>
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.to.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (invoices.length === 0) {
    return (
      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
        <EmptyState
          title="No invoices yet"
          description="Create your first invoice to start tracking your payments."
          actionLabel="Create Invoice"
          onAction={() => navigate(ROUTES.INVOICE_CREATE)}
        />
      </Box>
    );
  }

  return (
    <Box>
      <HStack mb={4} gap={4} flexWrap="wrap" justify="space-between">
        <SegmentedControl
          value={statusFilter}
          onChange={setStatusFilter}
          options={filterOptions}
        />
        <InputGroup size="sm" maxW="240px">
          <InputLeftElement pointerEvents="none">
            <MagnifyingGlass size={16} color={iconColor} />
          </InputLeftElement>
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
          />
        </InputGroup>
      </HStack>
      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100" overflow="hidden">
        {filtered.map((inv) => (
          <InvoiceCard
            key={inv.id}
            invoice={inv}
            onView={() => navigate(ROUTES.INVOICE_PREVIEW(inv.id))}
            onEdit={() => navigate(ROUTES.INVOICE_EDIT(inv.id))}
            onDuplicate={() => duplicate(inv.id, inv.invoiceNumber)}
            onMarkPaid={() => markPaid(inv.id)}
            onMarkSent={() => markSent(inv.id)}
            onDelete={() => remove(inv.id)}
            onActivity={() => { setSelectedInvoice(inv); onActivityOpen(); }}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            title="No matches found"
            description="Try adjusting your search or filters."
          />
        )}
      </Box>

      {selectedInvoice && (
        <ActivityLogDrawer
          isOpen={isActivityOpen}
          onClose={onActivityClose}
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.invoiceNumber}
        />
      )}
    </Box>
  );
};
