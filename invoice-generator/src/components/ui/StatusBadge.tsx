import { Badge } from '@chakra-ui/react';
import type { Invoice } from '../../types/invoice';

const STATUS_CONFIG: Record<Invoice['status'], { bg: string; color: string }> = {
  draft: { bg: 'brand.100', color: 'brand.600' },
  sent: { bg: 'accent.100', color: 'accent.700' },
  paid: { bg: 'success.100', color: 'success.600' },
  overdue: { bg: 'danger.100', color: 'danger.600' },
};

export const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
  const config = STATUS_CONFIG[status];
  return (
    <Badge bg={config.bg} color={config.color}>
      {status}
    </Badge>
  );
};
