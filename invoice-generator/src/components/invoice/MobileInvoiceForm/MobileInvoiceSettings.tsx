import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Text,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { CaretDown, CaretUp } from 'phosphor-react';
import { useState } from 'react';
import { CurrencySelect } from '../../ui/CurrencySelect';
import type { CurrencyCode } from '../../../types/currency';
import type { Invoice } from '../../../types/invoice';

interface MobileInvoiceSettingsProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  showTax: boolean;
  onShowTaxChange: (show: boolean) => void;
  discount: Invoice['discount'];
  onDiscountChange: (discount: Invoice['discount']) => void;
  showDiscount: boolean;
  onShowDiscountChange: (show: boolean) => void;
}

export const MobileInvoiceSettings = ({
  currency,
  onCurrencyChange,
  taxRate,
  onTaxRateChange,
  showTax,
  onShowTaxChange,
  discount,
  onDiscountChange,
  showDiscount,
  onShowDiscountChange,
}: MobileInvoiceSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDiscountTypeChange = (type: 'percentage' | 'fixed') => {
    if (!discount) {
      onDiscountChange({ type, value: 0 });
    } else {
      onDiscountChange({ ...discount, type });
    }
  };

  const handleDiscountValueChange = (value: number) => {
    if (!discount) {
      onDiscountChange({ type: 'percentage', value });
    } else {
      onDiscountChange({ ...discount, value });
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="brand.100"
      overflow="hidden"
    >
      <HStack
        justify="space-between"
        p={4}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Text fontWeight="600" fontSize="sm">
          Invoice Settings
        </Text>
        <IconButton
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          icon={isExpanded ? <CaretUp size={18} /> : <CaretDown size={18} />}
          size="sm"
          variant="ghost"
        />
      </HStack>

      <Collapse in={isExpanded}>
        <VStack spacing={4} p={4} pt={0} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm">Currency</FormLabel>
            <CurrencySelect value={currency} onChange={onCurrencyChange} />
          </FormControl>

          <FormControl>
            <HStack justify="space-between" mb={showTax ? 2 : 0}>
              <FormLabel fontSize="sm" mb={0}>Tax Rate (%)</FormLabel>
              <Switch
                size="sm"
                isChecked={showTax}
                onChange={(e) => onShowTaxChange(e.target.checked)}
              />
            </HStack>
            {showTax && (
              <Input
                type="number"
                size="sm"
                value={taxRate || ''}
                onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            )}
          </FormControl>

          <FormControl>
            <HStack justify="space-between" mb={showDiscount ? 2 : 0}>
              <FormLabel fontSize="sm" mb={0}>Discount</FormLabel>
              <Switch
                size="sm"
                isChecked={showDiscount}
                onChange={(e) => onShowDiscountChange(e.target.checked)}
              />
            </HStack>
            {showDiscount && (
              <HStack>
                <Select
                  size="sm"
                  value={discount?.type || 'percentage'}
                  onChange={(e) => handleDiscountTypeChange(e.target.value as 'percentage' | 'fixed')}
                  w="100px"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">Fixed</option>
                </Select>
                <Input
                  type="number"
                  size="sm"
                  value={discount?.value || ''}
                  onChange={(e) => handleDiscountValueChange(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </HStack>
            )}
          </FormControl>
        </VStack>
      </Collapse>
    </Box>
  );
};
