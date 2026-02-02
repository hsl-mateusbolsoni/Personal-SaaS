import { Box, Flex, Text, Input, IconButton, Button } from '@chakra-ui/react';
import { Trash, Plus } from 'phosphor-react';
import type { LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import { CurrencyInput } from '../../ui/CurrencyInput';
import { calculateLineItemAmount, formatCurrency } from '../../../utils/currency';

interface Props {
  items: LineItem[];
  currency: CurrencyCode;
  onChange: (items: LineItem[]) => void;
}

export const LineItemsTable = ({ items, currency, onChange }: Props) => {
  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        rateCents: 0,
        amountCents: 0,
      },
    ]);
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const newItem = { ...item, [field]: value };
      if (field === 'quantity' || field === 'rateCents') {
        newItem.amountCents = calculateLineItemAmount(
          field === 'quantity' ? (value as number) : newItem.quantity,
          field === 'rateCents' ? (value as number) : newItem.rateCents
        );
      }
      return newItem;
    });
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Flex
        px={2}
        py={2}
        bg="gray.50"
        borderRadius="md"
        mb={2}
        display={{ base: 'none', md: 'flex' }}
      >
        <Text flex={3} fontSize="xs" fontWeight="600" color="gray.600">Description</Text>
        <Text flex={1} fontSize="xs" fontWeight="600" color="gray.600" textAlign="right">Qty</Text>
        <Text flex={1} fontSize="xs" fontWeight="600" color="gray.600" textAlign="right">Rate</Text>
        <Text flex={1} fontSize="xs" fontWeight="600" color="gray.600" textAlign="right">Amount</Text>
        <Box w="32px" />
      </Flex>
      {items.map((item, index) => (
        <Flex
          key={item.id}
          align="center"
          gap={2}
          py={2}
          borderBottom="1px solid"
          borderColor="gray.100"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <Box flex={3} minW={{ base: '100%', md: 'auto' }}>
            <Input
              size="sm"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />
          </Box>
          <Box flex={1}>
            <Input
              size="sm"
              type="number"
              step="0.01"
              value={item.quantity || ''}
              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
            />
          </Box>
          <Box flex={1}>
            <CurrencyInput
              currency={currency}
              value={item.rateCents}
              onChange={(cents) => updateItem(index, 'rateCents', cents)}
            />
          </Box>
          <Text flex={1} fontSize="sm" textAlign="right" fontWeight="500">
            {formatCurrency(item.amountCents, currency)}
          </Text>
          <IconButton
            aria-label="Remove"
            icon={<Trash size={14} />}
            variant="ghost"
            size="xs"
            colorScheme="red"
            onClick={() => removeItem(index)}
          />
        </Flex>
      ))}
      <Button size="xs" variant="ghost" leftIcon={<Plus size={12} />} mt={2} onClick={addItem}>
        Add Item
      </Button>
    </Box>
  );
};
