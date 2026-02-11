import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { formatCurrency } from '../../utils/currency';
import { PAYMENT_TYPE_LABELS, getPaymentMethodSummary } from '../../types/payment';
import type { Invoice, InvoiceVisibility } from '../../types/invoice';
import type { PaymentMethod } from '../../types/payment';

const DEFAULT_VISIBILITY: InvoiceVisibility = {
  showLogo: true,
  showBusinessId: true,
  showBankDetails: true,
  showTax: true,
  showDiscount: true,
  showNotes: true,
};

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

interface InvoiceCanvasProps {
  invoice: Invoice;
  businessId?: string;
  paymentMethod?: PaymentMethod;
  logo?: string | null;
  visibility?: InvoiceVisibility;
}

export const InvoiceCanvas = ({ invoice, businessId, paymentMethod, logo, visibility: visibilityProp }: InvoiceCanvasProps) => {
  const visibility: InvoiceVisibility = {
    ...DEFAULT_VISIBILITY,
    ...(invoice.visibility || visibilityProp || {}),
  };

  const hasPaymentDetails = visibility.showBankDetails && paymentMethod && (
    paymentMethod.bankTransfer?.bankName ||
    paymentMethod.bankTransfer?.accountNumber ||
    paymentMethod.pix?.pixKey ||
    paymentMethod.paypal?.email ||
    paymentMethod.wise?.email ||
    paymentMethod.crypto?.walletAddress ||
    paymentMethod.other?.instructions
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
          {visibility.showLogo && logo && (
            <Image
              src={logo}
              alt="Logo"
              maxH="48px"
              maxW="140px"
              objectFit="contain"
              mb={3}
            />
          )}
          <Text fontSize="20px" fontWeight="700" color={colors.text} mb="4px">
            {invoice.from.name}
          </Text>
          {visibility.showBusinessId && businessId && (
            <Text fontSize="9px" color={colors.textMuted} mb="8px">
              {businessId}
            </Text>
          )}
          <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5">
            {[invoice.from.email, invoice.from.phone].filter(Boolean).join(' • ')}
          </Text>
          {invoice.from.address && (
            <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5">
              {invoice.from.address}
            </Text>
          )}
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
          <Text fontSize="10px" color={colors.text} fontWeight="500">
            {invoice.invoiceNumber}
          </Text>
        </Flex>
        <Flex justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Issue Date
          </Text>
          <Text fontSize="10px" color={colors.text} fontWeight="500">
            {formatDate(invoice.date)}
          </Text>
        </Flex>
        <Flex justify="space-between" mb="8px">
          <Text fontSize="9px" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.5px">
            Due Date
          </Text>
          <Text fontSize="10px" color={colors.text} fontWeight="500">
            {formatDate(invoice.dueDate)}
          </Text>
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
          <Text fontSize="14px" color={colors.text} fontWeight="700">
            {formatCurrency(invoice.totalCents, invoice.currency)}
          </Text>
        </Flex>
      </Box>

      {/* Bill To */}
      <Box mb="32px">
        <Text
          fontSize="9px"
          color={colors.textMuted}
          textTransform="uppercase"
          letterSpacing="0.5px"
          mb="8px"
        >
          Bill To
        </Text>
        <Text fontSize="11px" fontWeight="500" color={colors.text} mb="4px">
          {invoice.to.name}
        </Text>
        {invoice.to.email && (
          <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5">
            {invoice.to.email}
          </Text>
        )}
        {invoice.to.phone && (
          <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5">
            {invoice.to.phone}
          </Text>
        )}
        {invoice.to.address && (
          <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5" whiteSpace="pre-line">
            {invoice.to.address}
          </Text>
        )}
      </Box>

      {/* Line Items Table */}
      <Box mb="24px">
        {/* Table Header */}
        <Flex
          bg={colors.background}
          py="10px"
          px="12px"
          borderRadius="4px"
          mb="4px"
        >
          <Text flex={4} fontSize="9px" fontWeight="500" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.3px">
            Description
          </Text>
          <Text flex={1} fontSize="9px" fontWeight="500" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.3px" textAlign="right">
            Qty
          </Text>
          <Text flex={1.5} fontSize="9px" fontWeight="500" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.3px" textAlign="right">
            Unit Price
          </Text>
          <Text flex={1.5} fontSize="9px" fontWeight="500" color={colors.textSecondary} textTransform="uppercase" letterSpacing="0.3px" textAlign="right">
            Amount
          </Text>
        </Flex>

        {/* Table Rows */}
        {invoice.items.map((item) => (
          <Flex
            key={item.id}
            py="12px"
            px="12px"
            borderBottom="1px solid"
            borderColor={colors.borderLight}
          >
            <Text flex={4} fontSize="10px" color={colors.text}>
              {item.description}
            </Text>
            <Text flex={1} fontSize="10px" color={colors.textSecondary} textAlign="right">
              {item.quantity}
            </Text>
            <Text flex={1.5} fontSize="10px" color={colors.textSecondary} textAlign="right">
              {formatCurrency(item.rateCents, invoice.currency)}
            </Text>
            <Text flex={1.5} fontSize="10px" color={colors.text} textAlign="right">
              {formatCurrency(item.amountCents, invoice.currency)}
            </Text>
          </Flex>
        ))}
      </Box>

      {/* Totals */}
      <Flex justify="flex-end" mb="32px">
        <Box w="220px">
          <Flex justify="space-between" py="6px">
            <Text fontSize="10px" color={colors.textSecondary}>Subtotal</Text>
            <Text fontSize="10px" color={colors.text}>
              {formatCurrency(invoice.subtotalCents, invoice.currency)}
            </Text>
          </Flex>

          {visibility.showDiscount && invoice.discount && invoice.discountAmountCents > 0 && (
            <Flex justify="space-between" py="6px">
              <Text fontSize="10px" color={colors.textSecondary}>
                Discount{invoice.discount.type === 'percentage' ? ` (${invoice.discount.value}%)` : ''}
              </Text>
              <Text fontSize="10px" color={colors.success}>
                -{formatCurrency(invoice.discountAmountCents, invoice.currency)}
              </Text>
            </Flex>
          )}

          {visibility.showTax && invoice.taxRate > 0 && (
            <Flex justify="space-between" py="6px">
              <Text fontSize="10px" color={colors.textSecondary}>
                Tax ({invoice.taxRate}%)
              </Text>
              <Text fontSize="10px" color={colors.text}>
                {formatCurrency(invoice.taxAmountCents, invoice.currency)}
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
              {formatCurrency(invoice.totalCents, invoice.currency)}
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
      {visibility.showNotes && invoice.metadata?.notes && (
        <Box borderTop="1px solid" borderColor={colors.border} pt="16px">
          <Text
            fontSize="9px"
            color={colors.textMuted}
            textTransform="uppercase"
            letterSpacing="0.5px"
            mb="6px"
          >
            Notes
          </Text>
          <Text fontSize="9px" color={colors.textSecondary} lineHeight="1.5" whiteSpace="pre-line">
            {invoice.metadata.notes}
          </Text>
        </Box>
      )}
    </Box>
  );
};
