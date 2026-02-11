import { Box, Flex, Text, IconButton, HStack } from '@chakra-ui/react';
import { PencilSimple, Trash } from 'phosphor-react';
import type { LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import { formatCurrency } from '../../../utils/currency';

interface MobileLineItemProps {
  item: LineItem;
  currency: CurrencyCode;
  onEdit: () => void;
  onDelete: () => void;
}

export const MobileLineItem = ({
  item,
  currency,
  onEdit,
  onDelete,
}: MobileLineItemProps) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="brand.100"
      p={4}
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Box flex={1} onClick={onEdit} cursor="pointer">
          <Text fontWeight="500" fontSize="sm" noOfLines={2} mb={2}>
            {item.description || 'No description'}
          </Text>
          <HStack spacing={2} color="brand.500" fontSize="sm">
            <Text>{item.quantity} × {formatCurrency(item.rateCents, currency)}</Text>
            <Text>=</Text>
            <Text fontWeight="600" color="brand.700">
              {formatCurrency(item.amountCents, currency)}
            </Text>
          </HStack>
        </Box>
        <HStack spacing={1}>
          <IconButton
            aria-label="Edit item"
            icon={<PencilSimple size={18} />}
            size="sm"
            variant="ghost"
            onClick={onEdit}
          />
          <IconButton
            aria-label="Delete item"
            icon={<Trash size={18} />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onDelete}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
