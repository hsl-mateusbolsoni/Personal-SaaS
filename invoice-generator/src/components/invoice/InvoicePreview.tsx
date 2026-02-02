import { Box, Flex, Text, SimpleGrid, Divider } from '@chakra-ui/react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatting';
import type { Invoice } from '../../types/invoice';

export const InvoicePreviewComponent = ({ invoice }: { invoice: Invoice }) => (
  <Box bg="white" p={8} borderRadius="md" border="1px solid" borderColor="gray.200" maxW="800px" mx="auto">
    <Flex justify="space-between" mb={8} flexWrap="wrap" gap={4}>
      <Box>
        <Text fontSize="lg" fontWeight="700">{invoice.from.name}</Text>
        <Text fontSize="xs" color="gray.600">{invoice.from.email}</Text>
        <Text fontSize="xs" color="gray.600">{invoice.from.phone}</Text>
        <Text fontSize="xs" color="gray.600" whiteSpace="pre-line">{invoice.from.address}</Text>
      </Box>
      <Box textAlign="right">
        <Text fontSize="lg" fontWeight="700">Invoice {invoice.invoiceNumber}</Text>
        <Text fontSize="xs" color="gray.600">Date: {formatDate(invoice.date)}</Text>
        <Text fontSize="xs" color="gray.600">Due: {formatDate(invoice.dueDate)}</Text>
        <StatusBadge status={invoice.status} />
      </Box>
    </Flex>

    <Box mb={8}>
      <Text fontSize="xs" fontWeight="600" color="gray.500" mb={1}>Bill To</Text>
      <Text fontSize="sm" fontWeight="600">{invoice.to.name}</Text>
      <Text fontSize="xs" color="gray.600">{invoice.to.email}</Text>
      <Text fontSize="xs" color="gray.600">{invoice.to.phone}</Text>
      <Text fontSize="xs" color="gray.600" whiteSpace="pre-line">{invoice.to.address}</Text>
    </Box>

    <Box mb={6}>
      <SimpleGrid columns={4} py={2} borderBottom="2px solid" borderColor="gray.800">
        <Text fontSize="xs" fontWeight="700">Description</Text>
        <Text fontSize="xs" fontWeight="700" textAlign="right">Qty</Text>
        <Text fontSize="xs" fontWeight="700" textAlign="right">Rate</Text>
        <Text fontSize="xs" fontWeight="700" textAlign="right">Amount</Text>
      </SimpleGrid>
      {invoice.items.map((item) => (
        <SimpleGrid key={item.id} columns={4} py={2} borderBottom="1px solid" borderColor="gray.100">
          <Text fontSize="sm">{item.description}</Text>
          <Text fontSize="sm" textAlign="right">{item.quantity}</Text>
          <Text fontSize="sm" textAlign="right">{formatCurrency(item.rateCents, invoice.currency)}</Text>
          <Text fontSize="sm" textAlign="right">{formatCurrency(item.amountCents, invoice.currency)}</Text>
        </SimpleGrid>
      ))}
    </Box>

    <Box maxW="280px" ml="auto">
      <Row label="Subtotal" value={formatCurrency(invoice.subtotalCents, invoice.currency)} />
      {invoice.discount && invoice.discountAmountCents > 0 && (
        <Row
          label={`Discount (${invoice.discount.type === 'percentage' ? `${invoice.discount.value}%` : 'Fixed'})`}
          value={`-${formatCurrency(invoice.discountAmountCents, invoice.currency)}`}
        />
      )}
      <Row label={`Tax (${invoice.taxRate}%)`} value={formatCurrency(invoice.taxAmountCents, invoice.currency)} />
      <Divider borderColor="gray.800" borderWidth="2px" my={1} />
      <Flex justify="space-between" py={1}>
        <Text fontSize="sm" fontWeight="700">Total</Text>
        <Text fontSize="sm" fontWeight="700">{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
      </Flex>
    </Box>

    {invoice.metadata?.notes && (
      <Box mt={8} pt={4} borderTop="1px solid" borderColor="gray.100">
        <Text fontSize="xs" fontWeight="600" color="gray.500" mb={1}>Notes</Text>
        <Text fontSize="xs" color="gray.600">{invoice.metadata.notes}</Text>
      </Box>
    )}
  </Box>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="space-between" py={1}>
    <Text fontSize="xs" color="gray.600">{label}</Text>
    <Text fontSize="sm">{value}</Text>
  </Flex>
);
