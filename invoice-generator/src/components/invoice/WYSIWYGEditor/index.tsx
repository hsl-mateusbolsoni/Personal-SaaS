import { useCallback, useEffect } from 'react';
import { EditorCanvas } from './EditorCanvas';
import { useInvoiceForm } from '../../../hooks/useInvoiceForm';
import type { Invoice } from '../../../types/invoice';
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
  const form = useInvoiceForm({
    initial,
    visibility,
    currency,
    taxRate,
    discount,
    onTotalChange,
  });

  const handleSubmit = useCallback(() => {
    onSubmit(form.toDraft());
  }, [onSubmit, form.toDraft]);

  useEffect(() => {
    onSubmitRef?.(handleSubmit);
  }, [onSubmitRef, handleSubmit]);

  useEffect(() => {
    onAddItemRef?.(form.addItem);
  }, [onAddItemRef, form.addItem]);

  return (
    <EditorCanvas
      invoiceNumber={form.invoiceNumber}
      date={form.date}
      dueDate={form.dueDate}
      from={form.from}
      to={form.to}
      items={form.items}
      currency={currency}
      subtotalCents={form.totals.subtotalCents}
      discountAmountCents={form.totals.discountAmountCents}
      taxRate={taxRate}
      taxAmountCents={form.totals.taxAmountCents}
      totalCents={form.totals.totalCents}
      discount={discount}
      notes={form.notes}
      logo={form.logo}
      visibility={visibility}
      businessId={form.settings.businessId}
      paymentMethod={form.settings.paymentMethods.find((m) => m.isDefault)}
      onChangeInvoiceNumber={form.setInvoiceNumber}
      onChangeDate={form.setDate}
      onChangeDueDate={form.setDueDate}
      onChangeFrom={form.setFrom}
      onChangeTo={form.setTo}
      onChangeItems={form.setItems}
      onAddItem={form.addItem}
      onChangeNotes={form.setNotes}
      onChangeLogo={form.setLogo}
    />
  );
};

export type { VisibilitySettings as EditorVisibilitySettings };
