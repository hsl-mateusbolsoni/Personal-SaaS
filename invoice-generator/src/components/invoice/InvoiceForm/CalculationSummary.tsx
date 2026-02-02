import { Box, Flex, Text, Input, Select, HStack } from '@chakra-ui/react';
import type { Invoice } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyInput } from '../../ui/CurrencyInput';

interface Props {
  subtotalCents: number;
  discount: Invoice['discount'];
  discountAmountCents: number;
  taxRate: number;
  taxAmountCents: number;
  totalCents: number;
  currency: CurrencyCode;
  onChangeTaxRate: (rate: number) => void;
  onChangeDiscount: (discount: Invoice['discount']) => void;
}

export const CalculationSummary = ({
  subtotalCents, discount, discountAmountCents,
  taxRate, taxAmountCents, totalCents, currency,
  onChangeTaxRate, onChangeDiscount,
}: Props) => {
  return (
    <Box maxW="320px" ml="auto">
      <Row label="Subtotal" value={formatCurrency(subtotalCents, currency)} />
      <Flex align="center" justify="space-between" py={1.5}>
        <Text fontSize="xs" color="gray.600">Discount</Text>
        <HStack>
          <Select
            size="xs"
            w="80px"
            value={discount?.type || 'percentage'}
            onChange={(e) =>
              onChangeDiscount({
                type: e.target.value as 'percentage' | 'fixed',
                value: discount?.value || 0,
              })
            }
          >
            <option value="percentage">%</option>
            <option value="fixed">Fixed</option>
          </Select>
          {(!discount || discount.type === 'percentage') ? (
            <Input
              size="xs"
              w="60px"
              type="number"
              value={discount?.value || ''}
              onChange={(e) =>
                onChangeDiscount({
                  type: 'percentage',
                  value: parseFloat(e.target.value) || 0,
                })
              }
            />
          ) : (
            <CurrencyInput
              currency={currency}
              value={discount?.value || 0}
              onChange={(cents) => onChangeDiscount({ type: 'fixed', value: cents })}
            />
          )}
        </HStack>
      </Flex>
      {discountAmountCents > 0 && (
        <Row label="Discount Amount" value={`-${formatCurrency(discountAmountCents, currency)}`} />
      )}
      <Flex align="center" justify="space-between" py={1.5}>
        <Text fontSize="xs" color="gray.600">Tax Rate (%)</Text>
        <Input
          size="xs"
          w="60px"
          type="number"
          value={taxRate || ''}
          onChange={(e) => onChangeTaxRate(parseFloat(e.target.value) || 0)}
        />
      </Flex>
      <Row label="Tax" value={formatCurrency(taxAmountCents, currency)} />
      <Flex
        align="center"
        justify="space-between"
        py={2}
        mt={1}
        borderTop="2px solid"
        borderColor="gray.800"
      >
        <Text fontSize="sm" fontWeight="700">Total</Text>
        <Text fontSize="sm" fontWeight="700">{formatCurrency(totalCents, currency)}</Text>
      </Flex>
    </Box>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <Flex align="center" justify="space-between" py={1.5}>
    <Text fontSize="xs" color="gray.600">{label}</Text>
    <Text fontSize="sm">{value}</Text>
  </Flex>
);
