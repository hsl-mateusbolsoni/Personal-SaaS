import { Badge } from '@chakra-ui/react';
import type { Invoice } from '../../types/invoice';

const STATUS_COLORS: Record<Invoice['status'], string> = {
  draft: 'gray',
  sent: 'blue',
  paid: 'green',
  overdue: 'red',
};

export const StatusBadge = ({ status }: { status: Invoice['status'] }) => (
  <Badge colorScheme={STATUS_COLORS[status]} size="sm" textTransform="capitalize">
    {status}
  </Badge>
);
