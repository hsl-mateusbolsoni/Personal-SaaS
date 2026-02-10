import { Box, VStack, Text, Switch, FormControl, FormLabel, Input, Select, HStack, Button, Divider } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { CurrencySelect } from '../../ui/CurrencySelect';
import type { VisibilitySettings } from '../WYSIWYGEditor';
import type { Invoice } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

interface EditorSidebarProps {
  visibility: VisibilitySettings;
  onVisibilityChange: (visibility: VisibilitySettings) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  discount: Invoice['discount'];
  onDiscountChange: (discount: Invoice['discount']) => void;
  onAddItem: () => void;
}

export const EditorSidebar = ({
  visibility,
  onVisibilityChange,
  currency,
  onCurrencyChange,
  taxRate,
  onTaxRateChange,
  discount,
  onDiscountChange,
  onAddItem,
}: EditorSidebarProps) => {
  const toggle = (key: keyof VisibilitySettings) => {
    onVisibilityChange({ ...visibility, [key]: !visibility[key] });
  };

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
      w="300px"
      bg="white"
      borderRadius="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.100"
      p={5}
      position="sticky"
      top={6}
      maxH="calc(100vh - 180px)"
      overflowY="auto"
    >
      <VStack align="stretch" gap={5}>
        {/* Document Settings */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="brand.500" textTransform="uppercase" mb={3}>
            Document
          </Text>
          <VStack align="stretch" gap={3}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Currency</FormLabel>
              <CurrencySelect value={currency} onChange={onCurrencyChange} />
            </FormControl>
            <Button
              leftIcon={<Plus size={16} weight="bold" />}
              size="sm"
              variant="outline"
              onClick={onAddItem}
              w="100%"
            >
              Add Line Item
            </Button>
          </VStack>
        </Box>

        <Divider />

        {/* Company Section */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="brand.500" textTransform="uppercase" mb={3}>
            Company
          </Text>
          <VStack align="stretch" gap={3}>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel fontSize="sm" mb={0} fontWeight="normal">
                Company Logo
              </FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showLogo}
                onChange={() => toggle('showLogo')}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel fontSize="sm" mb={0} fontWeight="normal">
                Business ID
              </FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showBusinessId}
                onChange={() => toggle('showBusinessId')}
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Tax Section */}
        <Box>
          <FormControl>
            <HStack justify="space-between" mb={visibility.showTax ? 2 : 0}>
              <FormLabel fontSize="sm" fontWeight="500" mb={0}>Tax Rate (%)</FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showTax}
                onChange={() => toggle('showTax')}
              />
            </HStack>
            {visibility.showTax && (
              <Input
                type="number"
                size="sm"
                value={taxRate || ''}
                onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            )}
          </FormControl>
        </Box>

        <Divider />

        {/* Discount Section */}
        <Box>
          <FormControl>
            <HStack justify="space-between" mb={visibility.showDiscount ? 2 : 0}>
              <FormLabel fontSize="sm" fontWeight="500" mb={0}>Discount</FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showDiscount}
                onChange={() => toggle('showDiscount')}
              />
            </HStack>
            {visibility.showDiscount && (
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
        </Box>

        <Divider />

        {/* Payment & Notes Section */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="brand.500" textTransform="uppercase" mb={3}>
            Footer
          </Text>
          <VStack align="stretch" gap={3}>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel fontSize="sm" mb={0} fontWeight="normal">
                Payment Details
              </FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showBankDetails}
                onChange={() => toggle('showBankDetails')}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel fontSize="sm" mb={0} fontWeight="normal">
                Notes Section
              </FormLabel>
              <Switch
                size="sm"
                isChecked={visibility.showNotes}
                onChange={() => toggle('showNotes')}
              />
            </FormControl>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
