import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { ArrowRight } from 'phosphor-react';
import { formatCurrency } from '../../utils/currency';
import type { CurrencyCode } from '../../types/currency';

interface Props {
  totalCents: number;
  currency: CurrencyCode;
  onSubmit: () => void;
  submitLabel?: string;
  isDisabled?: boolean;
}

export const StickyInvoiceFooter = ({
  totalCents,
  currency,
  onSubmit,
  submitLabel = 'Create Invoice',
  isDisabled = false,
}: Props) => (
  <Box
    position="fixed"
    bottom={0}
    left={{ base: 0, md: '220px' }}
    right={0}
    bg="white"
    borderTop="1px solid"
    borderColor="brand.100"
    px={{ base: 4, md: 8 }}
    py={4}
    zIndex={100}
    shadow="lg"
  >
    <Flex maxW="1100px" mx="auto" justify="space-between" align="center">
      <Box>
        <Text fontSize="xs" fontWeight="500" color="brand.400" textTransform="uppercase">
          Invoice Total
        </Text>
        <Text fontSize="2xl" fontWeight="700" color="brand.800">
          {formatCurrency(totalCents, currency)}
        </Text>
      </Box>
      <Button
        size="lg"
        onClick={onSubmit}
        isDisabled={isDisabled}
        rightIcon={<ArrowRight size={18} weight="bold" />}
      >
        {submitLabel}
      </Button>
    </Flex>
  </Box>
);
