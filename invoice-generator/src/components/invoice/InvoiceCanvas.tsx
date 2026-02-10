import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { formatCurrency } from '../../utils/currency';
import { PAYMENT_TYPE_LABELS } from '../../config/payments';
import type { Invoice } from '../../types/invoice';
import type { BankDetails, PaymentType } from '../../types/settings';

interface InvoiceCanvasProps {
  invoice: Invoice;
  businessId?: string;
  paymentType?: PaymentType;
  bankDetails?: BankDetails;
  logo?: string | null;
}

export const InvoiceCanvas = ({ invoice, businessId, paymentType, bankDetails, logo }: InvoiceCanvasProps) => {
  const hasBankDetails = bankDetails && (
    bankDetails.bankName ||
    bankDetails.accountNumber ||
    bankDetails.iban
  );

  return (
    <Box
      bg="white"
      w="595px"
      minH="842px"
      p={10}
      fontFamily="'Manrope', sans-serif"
      color="#333"
      shadow="xl"
      mx="auto"
      display="flex"
      flexDirection="column"
    >
      {/* TOP SECTION */}
      <Box flex="1">
        {/* Header: Company + Invoice Details */}
        <Flex justify="space-between" mb={6}>
          {/* Company Info */}
          <Box>
            {logo && (
              <Image
                src={logo}
                alt="Logo"
                maxH="40px"
                maxW="120px"
                objectFit="contain"
                mb={2}
              />
            )}
            <Text fontSize="14pt" fontWeight="700" color="#111">
              {invoice.from.name}
            </Text>
            {businessId && (
              <Text fontSize="8pt" color="#888" mt="2px">{businessId}</Text>
            )}
            <Text fontSize="8pt" color="#555" mt={2}>{invoice.from.email}</Text>
            <Text fontSize="8pt" color="#555" mt="2px">{invoice.from.phone}</Text>
            <Text fontSize="8pt" color="#555" mt="2px" whiteSpace="pre-line">{invoice.from.address}</Text>
          </Box>

          {/* Invoice Details */}
          <Box textAlign="right">
            <Text fontSize="14pt" fontWeight="700" color="#111">
              {invoice.invoiceNumber}
            </Text>
            <Text fontSize="8pt" color="#555" mt={2}>Issued {invoice.date}</Text>
            <Text fontSize="8pt" color="#555" mt="2px">Due {invoice.dueDate}</Text>
          </Box>
        </Flex>

        {/* Bill To */}
        <Box mb={4}>
          <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
            Bill To
          </Text>
          <Text fontSize="10pt" fontWeight="600" color="#111">
            {invoice.to.name}
          </Text>
          <Text fontSize="8pt" color="#555" mt="2px">{invoice.to.email}</Text>
          <Text fontSize="8pt" color="#555" mt="2px">{invoice.to.phone}</Text>
          <Text fontSize="8pt" color="#555" mt="2px" whiteSpace="pre-line">{invoice.to.address}</Text>
        </Box>

        {/* Payment Details */}
        {hasBankDetails && (
          <Box mb={4}>
            <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Payment{paymentType && ` — ${PAYMENT_TYPE_LABELS[paymentType]}`}
            </Text>
            <Box fontSize="8pt" color="#555">
              {bankDetails?.bankName && <Text mt="2px">{bankDetails.bankName}</Text>}
              {bankDetails?.accountName && <Text mt="2px">{bankDetails.accountName}</Text>}
              {bankDetails?.accountNumber && <Text mt="2px">Account: {bankDetails.accountNumber}</Text>}
              {bankDetails?.routingNumber && <Text mt="2px">Routing: {bankDetails.routingNumber}</Text>}
              {bankDetails?.iban && <Text mt="2px">IBAN: {bankDetails.iban}</Text>}
              {bankDetails?.swiftBic && <Text mt="2px">SWIFT: {bankDetails.swiftBic}</Text>}
            </Box>
          </Box>
        )}
      </Box>

      {/* BOTTOM SECTION: Line Items + Totals */}
      <Box>
        {/* Line Items Table */}
        <Box mb={4}>
          <Flex
            borderBottom="1px solid #ddd"
            pb="6px"
            mb={1}
            fontSize="8pt"
            color="#888"
            textTransform="uppercase"
            letterSpacing="0.03em"
          >
            <Text flex={3}>Description</Text>
            <Text flex={1} textAlign="right">Qty</Text>
            <Text flex={1} textAlign="right">Rate</Text>
            <Text flex={1} textAlign="right">Amount</Text>
          </Flex>

          {invoice.items.map((item) => (
            <Flex
              key={item.id}
              py="6px"
              fontSize="8pt"
              color="#333"
              borderBottom="1px solid #f0f0f0"
            >
              <Text flex={3}>{item.description}</Text>
              <Text flex={1} textAlign="right">{item.quantity}</Text>
              <Text flex={1} textAlign="right">{formatCurrency(item.rateCents, invoice.currency)}</Text>
              <Text flex={1} textAlign="right">{formatCurrency(item.amountCents, invoice.currency)}</Text>
            </Flex>
          ))}
        </Box>

        {/* Totals */}
        <Flex justify="flex-end">
          <Box w="160px">
            <Flex justify="space-between" fontSize="8pt" color="#555" py="3px">
              <Text>Subtotal</Text>
              <Text>{formatCurrency(invoice.subtotalCents, invoice.currency)}</Text>
            </Flex>

            {invoice.discount && invoice.discountAmountCents > 0 && (
              <Flex justify="space-between" fontSize="8pt" color="#16a34a" py="3px">
                <Text>Discount{invoice.discount.type === 'percentage' ? ` ${invoice.discount.value}%` : ''}</Text>
                <Text>-{formatCurrency(invoice.discountAmountCents, invoice.currency)}</Text>
              </Flex>
            )}

            {invoice.taxRate > 0 && (
              <Flex justify="space-between" fontSize="8pt" color="#555" py="3px">
                <Text>Tax {invoice.taxRate}%</Text>
                <Text>{formatCurrency(invoice.taxAmountCents, invoice.currency)}</Text>
              </Flex>
            )}

            <Flex
              justify="space-between"
              fontSize="10pt"
              fontWeight="700"
              color="#111"
              borderTop="1px solid #333"
              pt="6px"
              mt={1}
            >
              <Text>Total</Text>
              <Text>{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Notes */}
        {invoice.metadata?.notes && (
          <Box mt={4} pt={3} borderTop="1px solid #eee">
            <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Notes
            </Text>
            <Text fontSize="8pt" color="#555" whiteSpace="pre-line">
              {invoice.metadata.notes}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
