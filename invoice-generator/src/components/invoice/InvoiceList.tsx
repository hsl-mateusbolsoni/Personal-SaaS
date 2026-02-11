import { Box, Input, HStack, InputGroup, InputLeftElement, useDisclosure, useToken, Menu, MenuButton, MenuList, MenuItem, Button, VStack, Text } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, CalendarBlank, CaretDown } from 'phosphor-react';
import { startOfWeek, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useInvoiceActions } from '../../hooks/useInvoiceActions';
import { InvoiceCard } from './InvoiceCard';
import { ActivityLogDrawer } from './ActivityLogDrawer';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ROUTES } from '../../config/routes';
import type { Invoice } from '../../types/invoice';

type StatusFilter = Invoice['status'] | 'all';
type DateFilter = 'all' | 'week' | 'month' | 'year';

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: 'All Time',
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
};

export const InvoiceList = () => {
  const invoices = useInvoiceStore((s) => s.invoices);
  const navigate = useNavigate();
  const { duplicate, markPaid, markSent, remove } = useInvoiceActions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const { isOpen: isActivityOpen, onOpen: onActivityOpen, onClose: onActivityClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [iconColor] = useToken('colors', ['brand.400']);

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    onDeleteOpen();
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      remove(invoiceToDelete.id);
      setInvoiceToDelete(null);
    }
  };

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

  const getDateFilterStart = (filter: DateFilter): Date | null => {
    const now = new Date();
    switch (filter) {
      case 'week':
        return startOfWeek(now, { weekStartsOn: 1 });
      case 'month':
        return startOfMonth(now);
      case 'year':
        return startOfYear(now);
      default:
        return null;
    }
  };

  const filtered = invoices
    .filter((inv) => statusFilter === 'all' || inv.status === statusFilter)
    .filter((inv) => {
      const dateStart = getDateFilterStart(dateFilter);
      if (!dateStart) return true;
      return isAfter(parseISO(inv.date), dateStart) || parseISO(inv.date).getTime() === dateStart.getTime();
    })
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
      <VStack spacing={3} mb={4} align="stretch">
        <HStack gap={4} flexWrap="wrap" justify="space-between">
          <SegmentedControl
            value={statusFilter}
            onChange={setStatusFilter}
            options={filterOptions}
          />
          <HStack gap={2}>
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="outline"
                leftIcon={<CalendarBlank size={14} />}
                rightIcon={<CaretDown size={12} />}
              >
                {DATE_FILTER_LABELS[dateFilter]}
              </MenuButton>
              <MenuList>
                {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map((key) => (
                  <MenuItem
                    key={key}
                    onClick={() => setDateFilter(key)}
                    fontWeight={dateFilter === key ? '600' : 'normal'}
                    bg={dateFilter === key ? 'accent.50' : undefined}
                  >
                    {DATE_FILTER_LABELS[key]}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <InputGroup size="sm" maxW="200px">
              <InputLeftElement pointerEvents="none">
                <MagnifyingGlass size={16} color={iconColor} />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="white"
              />
            </InputGroup>
          </HStack>
        </HStack>
        {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
          <Text fontSize="xs" color="brand.400">
            Showing {filtered.length} of {invoices.length} invoices
          </Text>
        )}
      </VStack>
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
            onDelete={() => handleDeleteClick(inv)}
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

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoiceToDelete?.invoiceNumber}? This action cannot be undone.`}
      />
    </Box>
  );
};
