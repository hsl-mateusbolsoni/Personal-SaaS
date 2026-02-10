import { Flex, Box, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { DotsThree } from 'phosphor-react';
import { StatusBadge } from '../ui/StatusBadge';
import { DueDateBadge } from '../ui/DueDateBadge';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatting';
import type { Invoice } from '../../types/invoice';

interface Props {
  invoice: Invoice;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onMarkPaid: () => void;
  onMarkSent: () => void;
  onDelete: () => void;
  onActivity: () => void;
}

export const InvoiceCard = ({ invoice, onView, onEdit, onDuplicate, onMarkPaid, onMarkSent, onDelete, onActivity }: Props) => (
  <Flex
    align="center"
    justify="space-between"
    py={4}
    px={6}
    borderBottom="1px solid"
    borderColor="brand.100"
    transition="background 0.15s"
    _hover={{ bg: 'brand.50', cursor: 'pointer' }}
    _last={{ borderBottom: 'none' }}
    onClick={onView}
  >
    <Flex align="center" gap={4} flex={1}>
      <Box>
        <Text fontSize="sm" fontWeight="600" color="brand.800">{invoice.invoiceNumber}</Text>
        <Text fontSize="sm" color="brand.500">{invoice.to.name}</Text>
      </Box>
    </Flex>
    <Flex align="center" gap={4}>
      <Text fontSize="sm" color="brand.400" display={{ base: 'none', md: 'block' }}>
        {formatDate(invoice.date)}
      </Text>
      <Box display={{ base: 'none', lg: 'block' }}>
        <DueDateBadge dueDate={invoice.dueDate} status={invoice.status} />
      </Box>
      <StatusBadge status={invoice.status} />
      <Text
        fontSize="sm"
        fontWeight="600"
        color="brand.800"
        minW="90px"
        textAlign="right"
      >
        {formatCurrency(invoice.totalCents, invoice.currency)}
      </Text>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Actions"
          icon={<DotsThree size={20} weight="bold" />}
          variant="ghost"
          size="sm"
          onClick={(e) => e.stopPropagation()}
        />
        <MenuList>
          <MenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>View</MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>Duplicate</MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); onActivity(); }}>Activity</MenuItem>
          <MenuDivider />
          {invoice.status === 'draft' && (
            <MenuItem onClick={(e) => { e.stopPropagation(); onMarkSent(); }}>Mark as Sent</MenuItem>
          )}
          {invoice.status !== 'paid' && (
            <MenuItem onClick={(e) => { e.stopPropagation(); onMarkPaid(); }}>Mark as Paid</MenuItem>
          )}
          <MenuDivider />
          <MenuItem color="danger.500" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  </Flex>
);
