import { Box, Flex, Text } from '@chakra-ui/react';
import { InlineText } from './InlineText';
import { InlineTextArea } from './InlineTextArea';
import { InlineLineItems } from './InlineLineItems';
import { LogoUpload } from './LogoUpload';
import { ClientCombobox } from './ClientCombobox';
import { useClientStore } from '../../../stores/useClientStore';
import { formatCurrency } from '../../../utils/currency';
import { PAYMENT_TYPE_LABELS, getPaymentMethodSummary } from '../../../types/payment';
import type { CompanyInfo, ClientInfo, LineItem, Invoice } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';
import type { PaymentMethod } from '../../../types/payment';
import type { Client } from '../../../types/client';

interface VisibilitySettings {
  showLogo: boolean;
  showBusinessId: boolean;
  showBankDetails: boolean;
  showTax: boolean;
  showDiscount: boolean;
  showNotes: boolean;
}

// Stripe-inspired color palette
const colors = {
  primary: '#635bff',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  background: '#f9fafb',
  success: '#10b981',
  white: '#ffffff',
};

interface EditorCanvasProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: CompanyInfo;
  to: ClientInfo;
  items: LineItem[];
  currency: CurrencyCode;
  subtotalCents: number;
  discountAmountCents: number;
  taxRate: number;
  taxAmountCents: number;
  totalCents: number;
  discount: Invoice['discount'];
  notes: string;
  logo: string | null;
  visibility: VisibilitySettings;
  businessId: string;
  paymentMethod?: PaymentMethod;
  onChangeInvoiceNumber: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeDueDate: (value: string) => void;
  onChangeFrom: (from: CompanyInfo) => void;
  onChangeTo: (to: ClientInfo) => void;
  onChangeItems: (items: LineItem[]) => void;
  onAddItem: () => void;
  onChangeNotes: (notes: string) => void;
  onChangeLogo: (logo: string | null) => void;
}

export const EditorCanvas = ({
  invoiceNumber,
  date,
  dueDate,
  from,
  to,
  items,
  currency,
  subtotalCents,
  discountAmountCents,
  taxRate,
  taxAmountCents,
  totalCents,
  discount,
  notes,
  logo,
  visibility,
  businessId,
  paymentMethod,
  onChangeInvoiceNumber,
  onChangeDate,
  onChangeDueDate,
  onChangeFrom,
  onChangeTo,
  onChangeItems,
  onAddItem,
  onChangeNotes,
  onChangeLogo,
}: EditorCanvasProps) => {
  const clients = useClientStore((s) => s.clients);

  const hasPaymentDetails = visibility.showBankDetails && paymentMethod && (
    paymentMethod.bankTransfer?.bankName ||
    paymentMethod.bankTransfer?.accountNumber ||
    paymentMethod.pix?.pixKey ||
    paymentMethod.paypal?.email ||
    paymentMethod.wise?.email ||
    paymentMethod.crypto?.walletAddress ||
    paymentMethod.other?.instructions
  );

  const updateFrom = (field: keyof CompanyInfo, value: string) => {
    onChangeFrom({ ...from, [field]: value });
  };

  const updateTo = (field: keyof ClientInfo, value: string) => {
    onChangeTo({ ...to, [field]: value });
  };

  const handleClientSelect = (client: Client | null) => {
    if (client) {
      onChangeTo({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Box
      bg={colors.white}
      w="595px"
      minH="842px"
      p="48px"
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      color={colors.text}
      shadow="xl"
      mx="auto"
      fontSize="10px"
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="40px">
        <Box flex={1}>
          <LogoUpload logo={logo} onChange={onChangeLogo} show={visibility.showLogo} />
          <InlineText
            value={from.name}
            onChange={(v) => updateFrom('name', v)}
            placeholder="Your Company"
            fontSize="20px"
            fontWeight="700"
            color={colors.text}
          />
          {visibility.showBusinessId && businessId && (
            <Text fontSize="9px" color={colors.textMuted} mt="4px" mb="8px">
              {businessId}
            </Text>
          )}
          <Box mt={2}>
            <InlineText
              value={from.email}
              onChange={(v) => updateFrom('email', v)}
              placeholder="email@company.com"
              fontSize="9px"
              color={colors.textSecondary}
            />
          </Box>
          <InlineText
            value={from.phone}
            onChange={(v) => updateFrom('phone', v)}
            placeholder="Phone"
            fontSize="9px"
            color={colors.textSecondary}
          />
          <InlineTextArea
            value={from.address}
            onChange={(v) => updateFrom('address', v)}
            placeholder="Address"
            fontSize="9px"
            color={colors.textSecondary}
            rows={2}
          />
        </Box>
        <Text
          fontSize="32px"
          fontWeight="300"
          color={colors.textMuted}
          letterSpacing="2px"
        >
          INVOICE
        </Text>
      </Flex>

      {/* Invoice Meta Box */}
      <Box
        bg={colors.background}
        borderRadius="6px"
        p="16px"
        mb="32px"
      >
        <Flex justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Invoice Number
          </Text>
          <InlineText
            value={invoiceNumber}
            onChange={onChangeInvoiceNumber}
            placeholder="INV-001"
            fontSize="10px"
            fontWeight="500"
            color={colors.text}
            textAlign="right"
          />
        </Flex>
        <Flex justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Issue Date
          </Text>
          <InlineText
            value={date}
            onChange={onChangeDate}
            type="date"
            fontSize="10px"
            fontWeight="500"
            color={colors.text}
            textAlign="right"
            displayValue={formatDate(date)}
          />
        </Flex>
        <Flex justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Due Date
          </Text>
          <InlineText
            value={dueDate}
            onChange={onChangeDueDate}
            type="date"
            fontSize="10px"
            fontWeight="500"
            color={colors.text}
            textAlign="right"
            displayValue={formatDate(dueDate)}
          />
        </Flex>
        <Flex
          justify="space-between"
          pt="8px"
          borderTop="1px solid"
          borderColor={colors.border}
        >
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Amount Due
          </Text>
          <Text fontSize="14px" fontWeight="700" color={colors.text}>
            {formatCurrency(totalCents, currency)}
          </Text>
        </Flex>
      </Box>

      {/* Bill To */}
      <Box mb="32px">
        <Flex align="center" justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px">
            Bill To
          </Text>
          <Box w="140px">
            <ClientCombobox
              clients={clients}
              onSelect={handleClientSelect}
            />
          </Box>
        </Flex>
        <InlineText
          value={to.name}
          onChange={(v) => updateTo('name', v)}
          placeholder="Client Name"
          fontSize="11px"
          fontWeight="500"
          color={colors.text}
        />
        <Box mt="4px">
          <InlineText
            value={to.email}
            onChange={(v) => updateTo('email', v)}
            placeholder="client@email.com"
            fontSize="9px"
            color={colors.textSecondary}
          />
        </Box>
        <InlineText
          value={to.phone}
          onChange={(v) => updateTo('phone', v)}
          placeholder="Phone"
          fontSize="9px"
          color={colors.textSecondary}
        />
        <InlineTextArea
          value={to.address}
          onChange={(v) => updateTo('address', v)}
          placeholder="Address"
          fontSize="9px"
          color={colors.textSecondary}
          rows={2}
        />
      </Box>

      {/* Line Items Table */}
      <Box mb="24px">
        <InlineLineItems
          items={items}
          currency={currency}
          onChange={onChangeItems}
          onAddItem={onAddItem}
        />
      </Box>

      {/* Totals */}
      <Flex justify="flex-end" mb="32px">
        <Box w="220px">
          <Flex justify="space-between" py="6px">
            <Text fontSize="10px" color={colors.textSecondary}>Subtotal</Text>
            <Text fontSize="10px" color={colors.text}>
              {formatCurrency(subtotalCents, currency)}
            </Text>
          </Flex>

          {visibility.showDiscount && discountAmountCents > 0 && (
            <Flex justify="space-between" py="6px">
              <Text fontSize="10px" color={colors.textSecondary}>
                Discount{discount?.type === 'percentage' ? ` (${discount.value}%)` : ''}
              </Text>
              <Text fontSize="10px" color={colors.success}>
                -{formatCurrency(discountAmountCents, currency)}
              </Text>
            </Flex>
          )}

          {visibility.showTax && taxRate > 0 && (
            <Flex justify="space-between" py="6px">
              <Text fontSize="10px" color={colors.textSecondary}>
                Tax ({taxRate}%)
              </Text>
              <Text fontSize="10px" color={colors.text}>
                {formatCurrency(taxAmountCents, currency)}
              </Text>
            </Flex>
          )}

          <Flex
            justify="space-between"
            py="12px"
            borderTop="2px solid"
            borderColor={colors.text}
            mt="4px"
          >
            <Text fontSize="12px" fontWeight="700" color={colors.text}>
              Total
            </Text>
            <Text fontSize="14px" fontWeight="700" color={colors.text}>
              {formatCurrency(totalCents, currency)}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Payment Details */}
      {hasPaymentDetails && paymentMethod && (
        <Box
          bg={colors.background}
          borderRadius="6px"
          p="16px"
          mb="24px"
        >
          <Text fontSize="10px" fontWeight="500" color={colors.text} mb="8px">
            Payment Details — {PAYMENT_TYPE_LABELS[paymentMethod.type]}
          </Text>
          <Box fontSize="9px" color={colors.textSecondary}>
            <Text mb="2px">{getPaymentMethodSummary(paymentMethod)}</Text>
            {paymentMethod.type === 'bank_transfer' && paymentMethod.bankTransfer && (
              <>
                {paymentMethod.bankTransfer.accountName && (
                  <Text mb="2px">Account Name: {paymentMethod.bankTransfer.accountName}</Text>
                )}
                {paymentMethod.bankTransfer.accountNumber && (
                  <Text mb="2px">Account Number: {paymentMethod.bankTransfer.accountNumber}</Text>
                )}
                {paymentMethod.bankTransfer.routingNumber && (
                  <Text mb="2px">Routing Number: {paymentMethod.bankTransfer.routingNumber}</Text>
                )}
                {paymentMethod.bankTransfer.iban && (
                  <Text mb="2px">IBAN: {paymentMethod.bankTransfer.iban}</Text>
                )}
                {paymentMethod.bankTransfer.swiftBic && (
                  <Text mb="2px">SWIFT/BIC: {paymentMethod.bankTransfer.swiftBic}</Text>
                )}
              </>
            )}
            {paymentMethod.type === 'pix' && paymentMethod.pix && (
              <>
                <Text mb="2px">PIX Key: {paymentMethod.pix.pixKey}</Text>
                {paymentMethod.pix.recipientName && (
                  <Text mb="2px">Recipient: {paymentMethod.pix.recipientName}</Text>
                )}
              </>
            )}
            {paymentMethod.type === 'crypto' && paymentMethod.crypto && (
              <Text mb="2px">{paymentMethod.crypto.walletAddress}</Text>
            )}
            {paymentMethod.type === 'other' && paymentMethod.other?.instructions && (
              <Text mb="2px" whiteSpace="pre-line">{paymentMethod.other.instructions}</Text>
            )}
          </Box>
        </Box>
      )}

      {/* Notes */}
      {visibility.showNotes && (
        <Box borderTop="1px solid" borderColor={colors.border} pt="16px">
          <Text fontSize="9px" color={colors.textMuted} textTransform="uppercase" letterSpacing="0.5px" mb="6px">
            Notes
          </Text>
          <InlineTextArea
            value={notes}
            onChange={onChangeNotes}
            placeholder="Add notes..."
            fontSize="9px"
            color={colors.textSecondary}
            rows={2}
          />
        </Box>
      )}
    </Box>
  );
};
