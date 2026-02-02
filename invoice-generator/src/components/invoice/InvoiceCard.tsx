import { Flex, Box, Text, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { DotsThree } from 'phosphor-react';
import { StatusBadge } from '../ui/StatusBadge';
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
}

export const InvoiceCard = ({ invoice, onView, onEdit, onDuplicate, onMarkPaid, onMarkSent, onDelete }: Props) => (
  <Flex
    align="center"
    justify="space-between"
    py={3}
    px={4}
    borderBottom="1px solid"
    borderColor="gray.100"
    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
    onClick={onView}
  >
    <Flex align="center" gap={4} flex={1}>
      <Box>
        <Text fontSize="sm" fontWeight="600">{invoice.invoiceNumber}</Text>
        <Text fontSize="xs" color="gray.500">{invoice.to.name}</Text>
      </Box>
    </Flex>
    <Flex align="center" gap={4}>
      <Text fontSize="xs" color="gray.500" display={{ base: 'none', md: 'block' }}>
        {formatDate(invoice.date)}
      </Text>
      <StatusBadge status={invoice.status} />
      <Text fontSize="sm" fontWeight="600" minW="80px" textAlign="right">
        {formatCurrency(invoice.totalCents, invoice.currency)}
      </Text>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Actions"
          icon={<DotsThree size={16} weight="bold" />}
          variant="ghost"
          size="xs"
          onClick={(e) => e.stopPropagation()}
        />
        <MenuList fontSize="sm">
          <MenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>View</MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>Duplicate</MenuItem>
          {invoice.status === 'draft' && (
            <MenuItem onClick={(e) => { e.stopPropagation(); onMarkSent(); }}>Mark as Sent</MenuItem>
          )}
          {invoice.status !== 'paid' && (
            <MenuItem onClick={(e) => { e.stopPropagation(); onMarkPaid(); }}>Mark as Paid</MenuItem>
          )}
          <MenuItem color="red.500" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  </Flex>
);
