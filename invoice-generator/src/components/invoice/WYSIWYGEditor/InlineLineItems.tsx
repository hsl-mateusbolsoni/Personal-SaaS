import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { Plus, Trash } from 'phosphor-react';
import { InlineText } from './InlineText';
import { InlineCurrency } from './InlineCurrency';
import type { LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

// Stripe-inspired color palette (matching EditorCanvas)
const colors = {
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  background: '#f9fafb',
};

interface InlineLineItemsProps {
  items: LineItem[];
  currency: CurrencyCode;
  onChange: (items: LineItem[]) => void;
  onAddItem: () => void;
}

export const InlineLineItems = ({
  items,
  currency,
  onChange,
  onAddItem,
}: InlineLineItemsProps) => {

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity') {
      item.quantity = typeof value === 'number' ? value : parseFloat(value) || 0;
      item.amountCents = item.quantity * item.rateCents;
    } else if (field === 'rateCents') {
      item.rateCents = typeof value === 'number' ? value : 0;
      item.amountCents = item.quantity * item.rateCents;
    } else if (field === 'description') {
      item.description = value as string;
    }

    newItems[index] = item;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <Box>
      {/* Table Header - matches PDF styling */}
      <Flex
        bg={colors.background}
        py="10px"
        px="12px"
        borderRadius="4px"
        mb="4px"
        fontSize="9px"
        fontWeight="500"
        color={colors.textSecondary}
        textTransform="uppercase"
        letterSpacing="0.3px"
      >
        <Text flex={4}>Description</Text>
        <Text flex={1} textAlign="right">Qty</Text>
        <Text flex={1.5} textAlign="right">Unit Price</Text>
        <Text flex={1.5} textAlign="right">Amount</Text>
        <Box w="24px" />
      </Flex>

      {/* Table Rows */}
      {items.map((item, index) => (
        <Flex
          key={item.id}
          align="center"
          py="12px"
          px="12px"
          fontSize="10px"
          borderBottom="1px solid"
          borderColor={colors.borderLight}
          _hover={{ bg: colors.background }}
          role="group"
        >
          <Box flex={4} pr={2}>
            <InlineText
              value={item.description}
              onChange={(v) => updateItem(index, 'description', v)}
              placeholder="Item description"
              fontSize="10px"
              color={colors.text}
            />
          </Box>
          <Box flex={1}>
            <InlineText
              value={item.quantity.toString()}
              onChange={(v) => updateItem(index, 'quantity', v)}
              placeholder="1"
              fontSize="10px"
              color={colors.textSecondary}
              textAlign="right"
            />
          </Box>
          <Box flex={1.5}>
            <InlineCurrency
              value={item.rateCents}
              onChange={(v) => updateItem(index, 'rateCents', v)}
              currency={currency}
              fontSize="10px"
              color={colors.textSecondary}
              textAlign="right"
            />
          </Box>
          <Box flex={1.5}>
            <InlineCurrency
              value={item.amountCents}
              onChange={() => {}}
              currency={currency}
              fontSize="10px"
              color={colors.text}
              textAlign="right"
              readOnly
            />
          </Box>
          <Box w="24px" pl={1}>
            <IconButton
              aria-label="Remove"
              icon={<Trash size={12} />}
              size="xs"
              variant="ghost"
              color={colors.textSecondary}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              onClick={() => removeItem(index)}
              minW="auto"
              h="auto"
              p={1}
            />
          </Box>
        </Flex>
      ))}

      {/* Add Item */}
      <Flex
        align="center"
        gap={1}
        mt={3}
        color="accent.500"
        cursor="pointer"
        fontSize="9px"
        fontWeight="500"
        _hover={{ color: 'accent.600' }}
        onClick={onAddItem}
      >
        <Plus size={12} weight="bold" />
        <Text>Add item</Text>
      </Flex>
    </Box>
  );
};
