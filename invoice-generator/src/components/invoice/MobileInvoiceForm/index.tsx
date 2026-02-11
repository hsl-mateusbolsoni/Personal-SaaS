import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Divider,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { useState, useMemo } from 'react';
import { MobileInvoiceSettings } from './MobileInvoiceSettings';
import { MobileLineItem } from './MobileLineItem';
import { LineItemModal } from './LineItemModal';
import { ClientSelector } from '../../client/ClientSelector';
import { useInvoiceForm } from '../../../hooks/useInvoiceForm';
import { formatCurrency } from '../../../utils/currency';
import { validateInvoiceDraft, type ValidationErrors, getFieldError, hasErrors, getErrorMessages } from '../../../utils/validation';
import type { Invoice, LineItem, InvoiceVisibility } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

interface MobileInvoiceFormProps {
  initial?: Invoice;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  discount: Invoice['discount'];
  onDiscountChange: (discount: Invoice['discount']) => void;
  showTax: boolean;
  onShowTaxChange: (show: boolean) => void;
  showDiscount: boolean;
  onShowDiscountChange: (show: boolean) => void;
  showLogo?: boolean;
  showBusinessId?: boolean;
  showBankDetails?: boolean;
  showNotes?: boolean;
  onSubmit: (draft: Partial<Invoice>) => void;
  onTotalChange?: (total: number) => void;
  submitLabel?: string;
}

export const MobileInvoiceForm = ({
  initial,
  currency,
  onCurrencyChange,
  taxRate,
  onTaxRateChange,
  discount,
  onDiscountChange,
  showTax,
  onShowTaxChange,
  showDiscount,
  onShowDiscountChange,
  showLogo = true,
  showBusinessId = true,
  showBankDetails = true,
  showNotes = true,
  onSubmit,
  onTotalChange,
  submitLabel = 'Create Invoice',
}: MobileInvoiceFormProps) => {
  const visibility: InvoiceVisibility = useMemo(() => ({
    showLogo,
    showBusinessId,
    showBankDetails,
    showTax,
    showDiscount,
    showNotes,
  }), [showLogo, showBusinessId, showBankDetails, showTax, showDiscount, showNotes]);

  const form = useInvoiceForm({
    initial,
    currency,
    taxRate,
    discount,
    visibility,
    onTotalChange,
  });

  // Mobile-specific UI state
  const { isOpen: isLineItemOpen, onOpen: openLineItem, onClose: closeLineItem } = useDisclosure();
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsNewItem(true);
    openLineItem();
  };

  const handleEditItem = (item: LineItem) => {
    setEditingItem(item);
    setIsNewItem(false);
    openLineItem();
  };

  const handleSaveItem = (item: LineItem) => {
    if (isNewItem) {
      form.setItems((prev) => [...prev, item]);
    } else {
      form.updateItem(item.id, item);
    }
  };

  const handleSubmit = () => {
    const draft = form.toDraft();
    const result = validateInvoiceDraft(draft);

    if (!result.success) {
      setErrors(result.errors);
      setShowErrors(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setShowErrors(false);
    onSubmit(draft);
  };

  return (
    <>
      <VStack spacing={4} align="stretch" pb={24}>
        {/* Validation Errors Alert */}
        {showErrors && hasErrors(errors) && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertDescription fontSize="sm">
              Please fix the following errors: {getErrorMessages(errors).slice(0, 3).join(', ')}
              {getErrorMessages(errors).length > 3 && ` and ${getErrorMessages(errors).length - 3} more`}
            </AlertDescription>
          </Alert>
        )}

        {/* Invoice Settings */}
        <MobileInvoiceSettings
          currency={currency}
          onCurrencyChange={onCurrencyChange}
          taxRate={taxRate}
          onTaxRateChange={onTaxRateChange}
          showTax={showTax}
          onShowTaxChange={onShowTaxChange}
          discount={discount}
          onDiscountChange={onDiscountChange}
          showDiscount={showDiscount}
          onShowDiscountChange={onShowDiscountChange}
        />

        {/* Invoice Details */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>Invoice Details</Text>
          <VStack spacing={3} align="stretch">
            <FormControl isInvalid={!!getFieldError(errors, 'invoiceNumber')}>
              <FormLabel fontSize="sm">Invoice Number</FormLabel>
              <Input
                size="sm"
                value={form.invoiceNumber}
                onChange={(e) => form.setInvoiceNumber(e.target.value)}
              />
              <FormErrorMessage fontSize="xs">{getFieldError(errors, 'invoiceNumber')}</FormErrorMessage>
            </FormControl>
            <HStack spacing={3}>
              <FormControl flex={1} isInvalid={!!getFieldError(errors, 'date')}>
                <FormLabel fontSize="sm">Date</FormLabel>
                <Input
                  type="date"
                  size="sm"
                  value={form.date}
                  onChange={(e) => form.setDate(e.target.value)}
                />
                <FormErrorMessage fontSize="xs">{getFieldError(errors, 'date')}</FormErrorMessage>
              </FormControl>
              <FormControl flex={1} isInvalid={!!getFieldError(errors, 'dueDate')}>
                <FormLabel fontSize="sm">Due Date</FormLabel>
                <Input
                  type="date"
                  size="sm"
                  value={form.dueDate}
                  onChange={(e) => form.setDueDate(e.target.value)}
                />
                <FormErrorMessage fontSize="xs">{getFieldError(errors, 'dueDate')}</FormErrorMessage>
              </FormControl>
            </HStack>
          </VStack>
        </Box>

        {/* From Section */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>From</Text>
          <VStack spacing={3} align="stretch">
            <FormControl isInvalid={!!getFieldError(errors, 'from.name')}>
              <FormLabel fontSize="sm">Business Name</FormLabel>
              <Input
                size="sm"
                value={form.from.name}
                onChange={(e) => form.setFrom({ ...form.from, name: e.target.value })}
              />
              <FormErrorMessage fontSize="xs">{getFieldError(errors, 'from.name')}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!getFieldError(errors, 'from.email')}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                size="sm"
                inputMode="email"
                value={form.from.email}
                onChange={(e) => form.setFrom({ ...form.from, email: e.target.value })}
              />
              <FormErrorMessage fontSize="xs">{getFieldError(errors, 'from.email')}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Phone</FormLabel>
              <Input
                type="tel"
                size="sm"
                inputMode="tel"
                value={form.from.phone}
                onChange={(e) => form.setFrom({ ...form.from, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Address</FormLabel>
              <Textarea
                size="sm"
                rows={2}
                value={form.from.address}
                onChange={(e) => form.setFrom({ ...form.from, address: e.target.value })}
              />
            </FormControl>
          </VStack>
        </Box>

        {/* To Section */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>Bill To</Text>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm">Select Client</FormLabel>
              <ClientSelector
                value={form.to.clientId}
                onChange={form.selectClient}
              />
            </FormControl>
            <Divider />
            <FormControl isInvalid={!!getFieldError(errors, 'to.name')}>
              <FormLabel fontSize="sm">Client Name</FormLabel>
              <Input
                size="sm"
                value={form.to.name}
                onChange={(e) => form.setTo({ ...form.to, name: e.target.value })}
              />
              <FormErrorMessage fontSize="xs">{getFieldError(errors, 'to.name')}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!getFieldError(errors, 'to.email')}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                size="sm"
                inputMode="email"
                value={form.to.email}
                onChange={(e) => form.setTo({ ...form.to, email: e.target.value })}
              />
              <FormErrorMessage fontSize="xs">{getFieldError(errors, 'to.email')}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Phone</FormLabel>
              <Input
                type="tel"
                size="sm"
                inputMode="tel"
                value={form.to.phone}
                onChange={(e) => form.setTo({ ...form.to, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Address</FormLabel>
              <Textarea
                size="sm"
                rows={2}
                value={form.to.address}
                onChange={(e) => form.setTo({ ...form.to, address: e.target.value })}
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Line Items */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor={getFieldError(errors, 'items') ? 'danger.300' : 'brand.100'} p={4}>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="600" fontSize="sm">Line Items</Text>
            <Button
              leftIcon={<Plus size={16} weight="bold" />}
              size="sm"
              variant="outline"
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </HStack>

          {form.items.length === 0 ? (
            <Box
              py={8}
              textAlign="center"
              color={getFieldError(errors, 'items') ? 'danger.500' : 'brand.400'}
              borderRadius="lg"
              border="2px dashed"
              borderColor={getFieldError(errors, 'items') ? 'danger.300' : 'brand.200'}
            >
              <Text fontSize="sm">
                {getFieldError(errors, 'items') || 'No items yet. Tap "Add Item" to begin.'}
              </Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              {form.items.map((item) => (
                <MobileLineItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => form.removeItem(item.id)}
                />
              ))}
            </VStack>
          )}
        </Box>

        {/* Notes */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>Notes</Text>
          <Textarea
            size="sm"
            rows={3}
            value={form.notes}
            onChange={(e) => form.setNotes(e.target.value)}
            placeholder="Additional notes for the client..."
          />
        </Box>

        {/* Summary */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>Summary</Text>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="brand.500">Subtotal</Text>
              <Text fontSize="sm">{formatCurrency(form.totals.subtotalCents, currency)}</Text>
            </HStack>
            {showDiscount && form.totals.discountAmountCents > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color="brand.500">Discount</Text>
                <Text fontSize="sm" color="success.600">
                  -{formatCurrency(form.totals.discountAmountCents, currency)}
                </Text>
              </HStack>
            )}
            {showTax && form.totals.taxAmountCents > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color="brand.500">Tax ({taxRate}%)</Text>
                <Text fontSize="sm">{formatCurrency(form.totals.taxAmountCents, currency)}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="600">Total</Text>
              <Text fontWeight="700" fontSize="lg" color="accent.600">
                {formatCurrency(form.totals.totalCents, currency)}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Submit Button */}
        <Button
          colorScheme="accent"
          size="lg"
          onClick={handleSubmit}
          w="100%"
        >
          {submitLabel}
        </Button>
      </VStack>

      {/* Line Item Modal */}
      <LineItemModal
        isOpen={isLineItemOpen}
        onClose={closeLineItem}
        item={editingItem}
        onSave={handleSaveItem}
        isNew={isNewItem}
      />
    </>
  );
};
