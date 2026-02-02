import { Box, Input, HStack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useInvoiceActions } from '../../hooks/useInvoiceActions';
import { InvoiceCard } from './InvoiceCard';
import { EmptyState } from '../ui/EmptyState';
import { ROUTES } from '../../config/routes';
import type { Invoice } from '../../types/invoice';

const STATUS_FILTERS: Array<Invoice['status'] | 'all'> = ['all', 'draft', 'sent', 'paid', 'overdue'];

export const InvoiceList = () => {
  const invoices = useInvoiceStore((s) => s.invoices);
  const navigate = useNavigate();
  const { duplicate, markPaid, markSent, remove } = useInvoiceActions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');

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
      <EmptyState
        title="No invoices yet"
        description="Create your first invoice to get started."
        actionLabel="Create Invoice"
        onAction={() => navigate(ROUTES.INVOICE_CREATE)}
      />
    );
  }

  return (
    <Box>
      <HStack mb={4} gap={2} flexWrap="wrap">
        <Input
          size="sm"
          placeholder="Search invoices..."
          maxW="240px"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            size="xs"
            variant={statusFilter === s ? 'solid' : 'ghost'}
            textTransform="capitalize"
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </Button>
        ))}
      </HStack>
      <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
        {filtered.map((inv) => (
          <InvoiceCard
            key={inv.id}
            invoice={inv}
            onView={() => navigate(ROUTES.INVOICE_PREVIEW(inv.id))}
            onEdit={() => navigate(ROUTES.INVOICE_EDIT(inv.id))}
            onDuplicate={() => duplicate(inv.id)}
            onMarkPaid={() => markPaid(inv.id)}
            onMarkSent={() => markSent(inv.id)}
            onDelete={() => remove(inv.id)}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState title="No matches" description="Try adjusting your search or filters." />
        )}
      </Box>
    </Box>
  );
};
