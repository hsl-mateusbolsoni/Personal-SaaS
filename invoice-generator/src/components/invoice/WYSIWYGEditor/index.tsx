import { useState, useCallback, useEffect } from 'react';
import { EditorCanvas } from './EditorCanvas';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { calculateInvoiceTotals } from '../../../utils/currency';
import { todayISO, futureDateISO } from '../../../utils/formatting';
import type { Invoice, CompanyInfo, ClientInfo, LineItem } from '../../../types/invoice';
import type { CurrencyCode } from '../../../types/currency';

export interface VisibilitySettings {
  showLogo: boolean;
  showBusinessId: boolean;
  showBankDetails: boolean;
  showTax: boolean;
  showDiscount: boolean;
  showNotes: boolean;
}

interface WYSIWYGEditorProps {
  initial?: Invoice;
  visibility: VisibilitySettings;
  currency: CurrencyCode;
  taxRate: number;
  discount: Invoice['discount'];
  onSubmitRef?: (fn: () => void) => void;
  onSubmit: (invoice: Partial<Invoice>) => void;
  onTotalChange?: (total: number) => void;
  onAddItemRef?: (fn: () => void) => void;
}

export const WYSIWYGEditor = ({
  initial,
  visibility,
  currency,
  taxRate,
  discount,
  onSubmitRef,
  onSubmit,
  onTotalChange,
  onAddItemRef,
}: WYSIWYGEditorProps) => {
  const settings = useSettingsStore((s) => s.settings);

  const [invoiceNumber, setInvoiceNumber] = useState(
    initial?.invoiceNumber || `${settings.invoiceNumberPrefix}${settings.nextInvoiceNumber.toString().padStart(3, '0')}`
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
  const [to, setTo] = useState<ClientInfo>(
    initial?.to || { name: '', email: '', phone: '', address: '' }
  );
  const [items, setItems] = useState<LineItem[]>(
    initial?.items || [
      { id: crypto.randomUUID(), description: '', quantity: 1, rateCents: 0, amountCents: 0 },
    ]
  );
  const [notes, setNotes] = useState(initial?.metadata?.notes || '');
  const [logo, setLogo] = useState<string | null>(null);

  const totals = calculateInvoiceTotals(items, taxRate, discount);

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totals.totalCents);
    }
  }, [totals.totalCents, onTotalChange]);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: '', quantity: 1, rateCents: 0, amountCents: 0 },
    ]);
  }, []);

  useEffect(() => {
    if (onAddItemRef) {
      onAddItemRef(addItem);
    }
  }, [onAddItemRef, addItem]);

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

  const handleSubmit = useCallback(() => {
    onSubmit(getDraft());
  }, [onSubmit, getDraft]);

  useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef(handleSubmit);
    }
  }, [onSubmitRef, handleSubmit]);

  return (
    <EditorCanvas
      invoiceNumber={invoiceNumber}
      date={date}
      dueDate={dueDate}
      from={from}
      to={to}
      items={items}
      currency={currency}
      subtotalCents={totals.subtotalCents}
      discountAmountCents={totals.discountAmountCents}
      taxRate={taxRate}
      taxAmountCents={totals.taxAmountCents}
      totalCents={totals.totalCents}
      discount={discount}
      notes={notes}
      logo={logo}
      visibility={visibility}
      businessId={settings.businessId}
      paymentType={settings.paymentType}
      bankDetails={settings.bankDetails}
      onChangeInvoiceNumber={setInvoiceNumber}
      onChangeDate={setDate}
      onChangeDueDate={setDueDate}
      onChangeFrom={setFrom}
      onChangeTo={setTo}
      onChangeItems={setItems}
      onAddItem={addItem}
      onChangeNotes={setNotes}
      onChangeLogo={setLogo}
    />
  );
};

export type { VisibilitySettings as EditorVisibilitySettings };
