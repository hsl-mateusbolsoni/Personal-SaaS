import { Box, VStack, Text, Button, Flex } from '@chakra-ui/react';
import { useState, useCallback, useEffect } from 'react';
import { InvoiceDetails } from './InvoiceDetails';
import { CompanySection } from './CompanySection';
import { ClientSection } from './ClientSection';
import { LineItemsTable } from './LineItemsTable';
import { CalculationSummary } from './CalculationSummary';
import { AutoSaveIndicator } from '../../ui/AutoSaveIndicator';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { calculateInvoiceTotals } from '../../../utils/currency';
import { todayISO, futureDateISO } from '../../../utils/formatting';
import type { Invoice, LineItem, CompanyInfo, ClientInfo } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

interface InvoiceFormProps {
  initial?: Invoice;
  onSubmit: (draft: Partial<Invoice>) => void;
  onAutoSave?: (draft: Partial<Invoice>) => void;
  submitLabel?: string;
}

export const InvoiceForm = ({ initial, onSubmit, onAutoSave, submitLabel = 'Create Invoice' }: InvoiceFormProps) => {
  const settings = useSettingsStore((s) => s.settings);

  const [invoiceNumber, setInvoiceNumber] = useState(
    initial?.invoiceNumber || `${settings.invoiceNumberPrefix}${settings.nextInvoiceNumber.toString().padStart(3, '0')}`
  );
  const [date, setDate] = useState(initial?.date || todayISO());
  const [dueDate, setDueDate] = useState(initial?.dueDate || futureDateISO(30));
  const [currency, setCurrency] = useState<CurrencyCode>(initial?.currency || settings.defaultCurrency);
  const [from, setFrom] = useState<CompanyInfo>(
    initial?.from || { name: settings.name, email: settings.email, phone: settings.phone, address: settings.address }
  );
  const [to, setTo] = useState<ClientInfo & { clientId?: string }>(
    initial?.to || { name: '', email: '', phone: '', address: '' }
  );
  const [items, setItems] = useState<LineItem[]>(
    initial?.items || [{ id: crypto.randomUUID(), description: '', quantity: 1, rateCents: 0, amountCents: 0 }]
  );
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? settings.defaultTaxRate);
  const [discount, setDiscount] = useState<Invoice['discount']>(initial?.discount || null);
  const [notes, setNotes] = useState(initial?.metadata?.notes || '');

  const totals = calculateInvoiceTotals(items, taxRate, discount);

  const getDraft = useCallback((): Partial<Invoice> => ({
    ...(initial?.id ? { id: initial.id } : {}),
    invoiceNumber, date, dueDate, currency, from, to, items,
    taxRate, discount, metadata: notes ? { notes } : undefined,
    ...totals,
  }), [invoiceNumber, date, dueDate, currency, from, to, items, taxRate, discount, notes, totals, initial?.id]);

  const { lastSaved, isSaving } = useAutoSave(getDraft(), onAutoSave || (() => {}), 10000);

  const handleSubmit = () => {
    onSubmit(getDraft());
  };

  return (
    <VStack gap={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
          Invoice Details
        </Text>
        {onAutoSave && <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />}
      </Flex>
      <InvoiceDetails
        invoiceNumber={invoiceNumber} date={date} dueDate={dueDate} currency={currency}
        onChangeNumber={setInvoiceNumber} onChangeDate={setDate} onChangeDueDate={setDueDate} onChangeCurrency={setCurrency}
      />

      <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
        From
      </Text>
      <CompanySection from={from} onChange={setFrom} />

      <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
        Bill To
      </Text>
      <ClientSection to={to} onChange={setTo} />

      <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
        Line Items
      </Text>
      <LineItemsTable items={items} currency={currency} onChange={setItems} />

      <CalculationSummary
        subtotalCents={totals.subtotalCents}
        discount={discount}
        discountAmountCents={totals.discountAmountCents}
        taxRate={taxRate}
        taxAmountCents={totals.taxAmountCents}
        totalCents={totals.totalCents}
        currency={currency}
        onChangeTaxRate={setTaxRate}
        onChangeDiscount={setDiscount}
      />

      <Flex justify="flex-end">
        <Button size="sm" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </Flex>
    </VStack>
  );
};
