import { Flex, Text, Spinner } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

export const AutoSaveIndicator = ({
  lastSaved,
  isSaving,
}: {
  lastSaved: Date | null;
  isSaving: boolean;
}) => {
  if (isSaving) {
    return (
      <Flex align="center" gap={2}>
        <Spinner size="xs" />
        <Text fontSize="xs" color="gray.600">Saving...</Text>
      </Flex>
    );
  }
  if (lastSaved) {
    return (
      <Text fontSize="xs" color="gray.600">
        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </Text>
    );
  }
  return null;
};
