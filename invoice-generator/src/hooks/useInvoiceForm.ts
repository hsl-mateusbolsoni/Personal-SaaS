import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { calculateInvoiceTotals } from '../utils/currency';
import { todayISO, futureDateISO } from '../utils/formatting';
import { generateInvoiceNumber } from '../utils/invoice';
import type { Invoice, CompanyInfo, ClientInfo, LineItem, InvoiceVisibility } from '../types/invoice';
import type { CurrencyCode } from '../types/currency';
import type { Client } from '../types/client';

interface UseInvoiceFormOptions {
  initial?: Invoice;
  currency: CurrencyCode;
  taxRate: number;
  discount: Invoice['discount'];
  visibility: InvoiceVisibility;
  onTotalChange?: (total: number) => void;
}

export function useInvoiceForm({
  initial,
  currency,
  taxRate,
  discount,
  visibility,
  onTotalChange,
}: UseInvoiceFormOptions) {
  const settings = useSettingsStore((s) => s.settings);
  const appSettings = useSettingsStore((s) => s.appSettings);

  const [invoiceNumber, setInvoiceNumber] = useState(
    initial?.invoiceNumber || generateInvoiceNumber(appSettings)
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
  const [logo, setLogo] = useState<string | null>(null);

  const totals = useMemo(
    () => calculateInvoiceTotals(items, taxRate, discount),
    [items, taxRate, discount]
  );

  useEffect(() => {
    onTotalChange?.(totals.totalCents);
  }, [totals.totalCents, onTotalChange]);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: '', quantity: 1, rateCents: 0, amountCents: 0 },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updated: LineItem) => {
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }, []);

  const selectClient = useCallback((client: Client | null) => {
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

  const toDraft = useCallback((): Partial<Invoice> => ({
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
    visibility,
    metadata: notes ? { notes } : undefined,
    ...totals,
  }), [invoiceNumber, date, dueDate, currency, from, to, items, taxRate, discount, visibility, notes, totals, initial?.id]);

  return {
    // State
    invoiceNumber, setInvoiceNumber,
    date, setDate,
    dueDate, setDueDate,
    from, setFrom,
    to, setTo,
    items, setItems,
    notes, setNotes,
    logo, setLogo,
    totals,

    // Item operations
    addItem,
    removeItem,
    updateItem,

    // Client selection
    selectClient,

    // Build draft
    toDraft,

    // Read-only refs
    settings,
    appSettings,
  };
}
