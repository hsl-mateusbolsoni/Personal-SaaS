import { Text } from '@chakra-ui/react';

interface Props {
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export const DueDateBadge = ({ dueDate, status }: Props) => {
  if (status === 'paid') return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <Text fontSize="xs" color="danger.600" fontWeight="500">
        {Math.abs(diffDays)}d overdue
      </Text>
    );
  }

  if (diffDays === 0) {
    return (
      <Text fontSize="xs" color="warning.600" fontWeight="500">
        Due today
      </Text>
    );
  }

  if (diffDays <= 7) {
    return (
      <Text fontSize="xs" color="warning.500" fontWeight="500">
        Due in {diffDays}d
      </Text>
    );
  }

  return (
    <Text fontSize="xs" color="brand.400">
      Due in {diffDays}d
    </Text>
  );
};
