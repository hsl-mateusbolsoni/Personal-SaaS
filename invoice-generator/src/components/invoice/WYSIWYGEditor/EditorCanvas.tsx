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

  const hasPaymentDetails = paymentMethod && (
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
            <LogoUpload logo={logo} onChange={onChangeLogo} show={visibility.showLogo} />
            <InlineText
              value={from.name}
              onChange={(v) => updateFrom('name', v)}
              placeholder="Your Company"
              fontSize="14pt"
              fontWeight="700"
              color="#111"
            />
            {visibility.showBusinessId && businessId && (
              <Text fontSize="8pt" color="#888" mt="2px">{businessId}</Text>
            )}
            <Box mt={2}>
              <InlineText
                value={from.email}
                onChange={(v) => updateFrom('email', v)}
                placeholder="email@company.com"
                fontSize="8pt"
                color="#555"
              />
            </Box>
            <InlineText
              value={from.phone}
              onChange={(v) => updateFrom('phone', v)}
              placeholder="Phone"
              fontSize="8pt"
              color="#555"
            />
            <InlineTextArea
              value={from.address}
              onChange={(v) => updateFrom('address', v)}
              placeholder="Address"
              fontSize="8pt"
              color="#555"
              rows={2}
            />
          </Box>

          {/* Invoice Details */}
          <Box textAlign="right">
            <InlineText
              value={invoiceNumber}
              onChange={onChangeInvoiceNumber}
              placeholder="INV-001"
              fontSize="14pt"
              fontWeight="700"
              color="#111"
              textAlign="right"
            />
            <Flex justify="flex-end" align="center" mt={2}>
              <Text fontSize="8pt" color="#555" mr={1}>Issued</Text>
              <InlineText
                value={date}
                onChange={onChangeDate}
                type="date"
                fontSize="8pt"
                color="#555"
                textAlign="right"
              />
            </Flex>
            <Flex justify="flex-end" align="center" mt="2px">
              <Text fontSize="8pt" color="#555" mr={1}>Due</Text>
              <InlineText
                value={dueDate}
                onChange={onChangeDueDate}
                type="date"
                fontSize="8pt"
                color="#555"
                textAlign="right"
              />
            </Flex>
          </Box>
        </Flex>

        {/* Bill To */}
        <Box mb={4}>
          <Flex align="center" justify="space-between" mb={1}>
            <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em">
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
            fontSize="10pt"
            fontWeight="600"
            color="#111"
          />
          <Box mt="2px">
            <InlineText
              value={to.email}
              onChange={(v) => updateTo('email', v)}
              placeholder="client@email.com"
              fontSize="8pt"
              color="#555"
            />
          </Box>
          <InlineText
            value={to.phone}
            onChange={(v) => updateTo('phone', v)}
            placeholder="Phone"
            fontSize="8pt"
            color="#555"
          />
          <InlineTextArea
            value={to.address}
            onChange={(v) => updateTo('address', v)}
            placeholder="Address"
            fontSize="8pt"
            color="#555"
            rows={2}
          />
        </Box>

        {/* Payment Details */}
        {visibility.showBankDetails && hasPaymentDetails && paymentMethod && (
          <Box mb={4}>
            <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Payment — {PAYMENT_TYPE_LABELS[paymentMethod.type]}
            </Text>
            <Box fontSize="8pt" color="#555">
              <Text mt="2px">{getPaymentMethodSummary(paymentMethod)}</Text>
              {paymentMethod.type === 'bank_transfer' && paymentMethod.bankTransfer && (
                <>
                  {paymentMethod.bankTransfer.accountName && <Text mt="2px">{paymentMethod.bankTransfer.accountName}</Text>}
                  {paymentMethod.bankTransfer.accountNumber && <Text mt="2px">Account: {paymentMethod.bankTransfer.accountNumber}</Text>}
                  {paymentMethod.bankTransfer.routingNumber && <Text mt="2px">Routing: {paymentMethod.bankTransfer.routingNumber}</Text>}
                  {paymentMethod.bankTransfer.iban && <Text mt="2px">IBAN: {paymentMethod.bankTransfer.iban}</Text>}
                  {paymentMethod.bankTransfer.swiftBic && <Text mt="2px">SWIFT: {paymentMethod.bankTransfer.swiftBic}</Text>}
                </>
              )}
              {paymentMethod.type === 'pix' && paymentMethod.pix && (
                <>
                  <Text mt="2px">PIX: {paymentMethod.pix.pixKey}</Text>
                  {paymentMethod.pix.recipientName && <Text mt="2px">{paymentMethod.pix.recipientName}</Text>}
                </>
              )}
              {paymentMethod.type === 'crypto' && paymentMethod.crypto && (
                <Text mt="2px">{paymentMethod.crypto.walletAddress}</Text>
              )}
              {paymentMethod.type === 'other' && paymentMethod.other?.instructions && (
                <Text mt="2px" whiteSpace="pre-line">{paymentMethod.other.instructions}</Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* BOTTOM SECTION: Line Items + Totals */}
      <Box>
        {/* Line Items */}
        <InlineLineItems
          items={items}
          currency={currency}
          onChange={onChangeItems}
          onAddItem={onAddItem}
        />

        {/* Totals */}
        <Flex justify="flex-end">
          <Box w="160px">
            <Flex justify="space-between" fontSize="8pt" color="#555" py="3px">
              <Text>Subtotal</Text>
              <Text>{formatCurrency(subtotalCents, currency)}</Text>
            </Flex>

            {visibility.showDiscount && discountAmountCents > 0 && (
              <Flex justify="space-between" fontSize="8pt" color="#16a34a" py="3px">
                <Text>Discount{discount?.type === 'percentage' ? ` ${discount.value}%` : ''}</Text>
                <Text>-{formatCurrency(discountAmountCents, currency)}</Text>
              </Flex>
            )}

            {visibility.showTax && taxRate > 0 && (
              <Flex justify="space-between" fontSize="8pt" color="#555" py="3px">
                <Text>Tax {taxRate}%</Text>
                <Text>{formatCurrency(taxAmountCents, currency)}</Text>
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
              <Text>{formatCurrency(totalCents, currency)}</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Notes */}
        {visibility.showNotes && (
          <Box mt={4} pt={3} borderTop="1px solid #eee">
            <Text fontSize="8pt" color="#888" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Notes
            </Text>
            <InlineTextArea
              value={notes}
              onChange={onChangeNotes}
              placeholder="Add notes..."
              fontSize="8pt"
              color="#555"
              rows={2}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
