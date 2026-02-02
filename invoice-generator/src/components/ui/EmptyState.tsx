import { Flex, Text, Button } from '@chakra-ui/react';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Flex direction="column" align="center" justify="center" py={16} gap={3}>
    <Text fontSize="md" fontWeight="600" color="gray.700">
      {title}
    </Text>
    <Text fontSize="sm" color="gray.500" textAlign="center" maxW="sm">
      {description}
    </Text>
    {actionLabel && onAction && (
      <Button size="sm" mt={2} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Flex>
);
