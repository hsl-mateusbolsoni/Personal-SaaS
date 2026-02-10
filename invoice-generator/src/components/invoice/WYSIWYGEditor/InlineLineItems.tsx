import { Box, Flex, Text, IconButton, useToken } from '@chakra-ui/react';
import { Plus, Trash } from 'phosphor-react';
import { InlineText } from './InlineText';
import { InlineCurrency } from './InlineCurrency';
import type { LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

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
  const [textColor] = useToken('colors', ['brand.800']);

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
    <Box mb={4}>
      {/* Table Header */}
      <Flex
        borderBottom="1px solid"
        borderColor="brand.200"
        pb={2}
        mb={2}
        fontSize="8pt"
        color="brand.400"
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        <Text flex={3}>Description</Text>
        <Text flex={1} textAlign="right">Qty</Text>
        <Text flex={1} textAlign="right">Rate</Text>
        <Text flex={1} textAlign="right">Amount</Text>
        <Box w="24px" />
      </Flex>

      {/* Table Rows */}
      {items.map((item, index) => (
        <Flex
          key={item.id}
          align="center"
          py={2}
          fontSize="8pt"
          color="brand.800"
          borderBottom="1px solid"
          borderColor="brand.100"
          _hover={{ bg: 'brand.50' }}
          role="group"
        >
          <Box flex={3} pr={2}>
            <InlineText
              value={item.description}
              onChange={(v) => updateItem(index, 'description', v)}
              placeholder="Item description"
              fontSize="8pt"
              color={textColor}
            />
          </Box>
          <Box flex={1}>
            <InlineText
              value={item.quantity.toString()}
              onChange={(v) => updateItem(index, 'quantity', v)}
              placeholder="1"
              fontSize="8pt"
              color={textColor}
              textAlign="right"
            />
          </Box>
          <Box flex={1}>
            <InlineCurrency
              value={item.rateCents}
              onChange={(v) => updateItem(index, 'rateCents', v)}
              currency={currency}
              fontSize="8pt"
              textAlign="right"
            />
          </Box>
          <Box flex={1}>
            <InlineCurrency
              value={item.amountCents}
              onChange={() => {}}
              currency={currency}
              fontSize="8pt"
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
              color="brand.400"
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
        fontSize="8pt"
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
