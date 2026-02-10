import { Flex, Text, Button, useToken } from '@chakra-ui/react';
import { FileText } from 'phosphor-react';

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
}) => {
  const [iconColor] = useToken('colors', ['brand.300']);

  return (
  <Flex direction="column" align="center" justify="center" py={16} px={8} gap={4}>
    <FileText size={48} weight="duotone" color={iconColor} />
    <Text fontSize="md" fontWeight="600" color="brand.700">
      {title}
    </Text>
    <Text fontSize="sm" color="brand.400" textAlign="center" maxW="sm">
      {description}
    </Text>
    {actionLabel && onAction && (
      <Button mt={2} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Flex>
  );
};
