import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { useState, useCallback, useEffect } from 'react';
import { MobileInvoiceSettings } from './MobileInvoiceSettings';
import { MobileLineItem } from './MobileLineItem';
import { LineItemModal } from './LineItemModal';
import { ClientSelector } from '../../client/ClientSelector';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { calculateInvoiceTotals, formatCurrency } from '../../../utils/currency';
import { todayISO, futureDateISO } from '../../../utils/formatting';
import type { Invoice, CompanyInfo, ClientInfo, LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import type { Client } from '../../../types/client';

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
  onSubmit,
  onTotalChange,
  submitLabel = 'Create Invoice',
}: MobileInvoiceFormProps) => {
  const settings = useSettingsStore((s) => s.settings);
  const appSettings = useSettingsStore((s) => s.appSettings);

  const { isOpen: isLineItemOpen, onOpen: openLineItem, onClose: closeLineItem } = useDisclosure();
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState(
    initial?.invoiceNumber || `${appSettings.invoiceNumberPrefix}${appSettings.nextInvoiceNumber.toString().padStart(3, '0')}`
  );
  const [date, setDate] = useState(initial?.date || todayISO());
  const [dueDate, setDueDate] = useState(initial?.dueDate || futureDateISO(30));
  const [from, setFrom] = useState<CompanyInfo>(
    initial?.from || {
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
    }
  );
  const [to, setTo] = useState<ClientInfo & { clientId?: string }>(
    initial?.to || { name: '', email: '', phone: '', address: '' }
  );
  const [items, setItems] = useState<LineItem[]>(
    initial?.items || []
  );
  const [notes, setNotes] = useState(initial?.metadata?.notes || '');

  const totals = calculateInvoiceTotals(items, taxRate, discount);

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totals.totalCents);
    }
  }, [totals.totalCents, onTotalChange]);

  const handleClientSelect = useCallback((client: Client | null) => {
    if (client) {
      setTo({
        clientId: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        address: client.address || '',
      });
    } else {
      setTo({ name: '', email: '', phone: '', address: '' });
    }
  }, []);

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
      setItems((prev) => [...prev, item]);
    } else {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const getDraft = useCallback((): Partial<Invoice> => ({
    ...(initial?.id ? { id: initial.id } : {}),
    invoiceNumber,
    date,
    dueDate,
    currency,
    from,
    to,
    items,
    taxRate,
    discount,
    metadata: notes ? { notes } : undefined,
    ...totals,
  }), [invoiceNumber, date, dueDate, currency, from, to, items, taxRate, discount, notes, totals, initial?.id]);

  const handleSubmit = () => {
    onSubmit(getDraft());
  };

  return (
    <>
      <VStack spacing={4} align="stretch" pb={24}>
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
            <FormControl>
              <FormLabel fontSize="sm">Invoice Number</FormLabel>
              <Input
                size="sm"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </FormControl>
            <HStack spacing={3}>
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Date</FormLabel>
                <Input
                  type="date"
                  size="sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Due Date</FormLabel>
                <Input
                  type="date"
                  size="sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </FormControl>
            </HStack>
          </VStack>
        </Box>

        {/* From Section */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>From</Text>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm">Business Name</FormLabel>
              <Input
                size="sm"
                value={from.name}
                onChange={(e) => setFrom({ ...from, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                size="sm"
                value={from.email}
                onChange={(e) => setFrom({ ...from, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Phone</FormLabel>
              <Input
                type="tel"
                size="sm"
                value={from.phone}
                onChange={(e) => setFrom({ ...from, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Address</FormLabel>
              <Textarea
                size="sm"
                rows={2}
                value={from.address}
                onChange={(e) => setFrom({ ...from, address: e.target.value })}
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
                value={to.clientId}
                onChange={handleClientSelect}
              />
            </FormControl>
            <Divider />
            <FormControl>
              <FormLabel fontSize="sm">Client Name</FormLabel>
              <Input
                size="sm"
                value={to.name}
                onChange={(e) => setTo({ ...to, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                size="sm"
                value={to.email}
                onChange={(e) => setTo({ ...to, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Phone</FormLabel>
              <Input
                type="tel"
                size="sm"
                value={to.phone}
                onChange={(e) => setTo({ ...to, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Address</FormLabel>
              <Textarea
                size="sm"
                rows={2}
                value={to.address}
                onChange={(e) => setTo({ ...to, address: e.target.value })}
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Line Items */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
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

          {items.length === 0 ? (
            <Box
              py={8}
              textAlign="center"
              color="brand.400"
              borderRadius="lg"
              border="2px dashed"
              borderColor="brand.200"
            >
              <Text fontSize="sm">No items yet. Tap "Add Item" to begin.</Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              {items.map((item) => (
                <MobileLineItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the client..."
          />
        </Box>

        {/* Summary */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="brand.100" p={4}>
          <Text fontWeight="600" fontSize="sm" mb={4}>Summary</Text>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="brand.500">Subtotal</Text>
              <Text fontSize="sm">{formatCurrency(totals.subtotalCents, currency)}</Text>
            </HStack>
            {showDiscount && totals.discountAmountCents > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color="brand.500">Discount</Text>
                <Text fontSize="sm" color="success.600">
                  -{formatCurrency(totals.discountAmountCents, currency)}
                </Text>
              </HStack>
            )}
            {showTax && totals.taxAmountCents > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color="brand.500">Tax ({taxRate}%)</Text>
                <Text fontSize="sm">{formatCurrency(totals.taxAmountCents, currency)}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="600">Total</Text>
              <Text fontWeight="700" fontSize="lg" color="accent.600">
                {formatCurrency(totals.totalCents, currency)}
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
