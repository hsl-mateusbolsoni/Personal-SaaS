import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useClientStore } from '../stores/useClientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useActivityStore } from '../stores/useActivityStore';
import { calculateInvoiceTotals } from '../utils/currency';
import { generateInvoiceNumber, calculateDueDate } from '../utils/invoice';
import { toast } from '../utils/toast';
import type { Invoice } from '../types/invoice';
import { ROUTES } from '../config/routes';

export const useInvoiceActions = () => {
  const navigate = useNavigate();
  const addInvoice = useInvoiceStore((s) => s.addInvoice);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
  const addActivity = useActivityStore((s) => s.addActivity);
  const deleteActivities = useActivityStore((s) => s.deleteActivitiesForInvoice);

  const buildInvoice = useCallback((draft: Partial<Invoice>): Invoice => {
    const { settings, appSettings, incrementInvoiceNumber } = useSettingsStore.getState();
    const invoiceNumber = draft.invoiceNumber || generateInvoiceNumber(appSettings);
    const taxRate = draft.taxRate ?? appSettings.defaultTaxRate;
    const items = draft.items || [];
    const discount = draft.discount || null;
    const totals = calculateInvoiceTotals(items, taxRate, discount);

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber,
      date: draft.date || new Date().toISOString().split('T')[0],
      dueDate: draft.dueDate || calculateDueDate(30),
      status: 'draft',
      currency: draft.currency || appSettings.defaultCurrency,
      taxRate,
      from: draft.from || {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
      },
      to: draft.to || { name: '', email: '', phone: '', address: '' },
      items,
      discount,
      ...totals,
      visibility: draft.visibility,
      metadata: draft.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (invoice.to.clientId) {
      useClientStore.getState().updateClient(invoice.to.clientId, {
        lastUsed: new Date().toISOString(),
      });
    }
    incrementInvoiceNumber();

    return invoice;
  }, []);

  const create = useCallback(
    (draft: Partial<Invoice>) => {
      const invoice = buildInvoice(draft);
      addInvoice(invoice);
      addActivity(invoice.id, 'created', `Invoice ${invoice.invoiceNumber} created`);
      toast.success({ title: 'Invoice created' });
      navigate(ROUTES.INVOICE_PREVIEW(invoice.id));
      return invoice;
    },
    [navigate, addInvoice, addActivity, buildInvoice]
  );

  const duplicate = useCallback(
    (id: string, originalNumber: string) => {
      const original = useInvoiceStore.getState().getInvoice(id);
      if (!original) throw new Error('Invoice not found');

      const invoice = buildInvoice({
        ...original,
        id: undefined,
        invoiceNumber: undefined,
        date: new Date().toISOString().split('T')[0],
        dueDate: calculateDueDate(30),
        status: 'draft',
      });
      addInvoice(invoice);

      addActivity(id, 'duplicated', `Duplicated to ${invoice.invoiceNumber}`);
      addActivity(invoice.id, 'created', `Duplicated from ${originalNumber}`);
      toast.success({ title: 'Invoice duplicated' });
      navigate(ROUTES.INVOICE_EDIT(invoice.id));
      return invoice;
    },
    [navigate, addInvoice, addActivity, buildInvoice]
  );

  const markPaid = useCallback(
    (id: string) => {
      updateInvoice(id, { status: 'paid', updatedAt: new Date().toISOString() });
      addActivity(id, 'paid');
      toast.success({ title: 'Invoice marked as paid' });
    },
    [updateInvoice, addActivity]
  );

  const markSent = useCallback(
    (id: string) => {
      updateInvoice(id, { status: 'sent', updatedAt: new Date().toISOString() });
      addActivity(id, 'sent');
      toast.info({ title: 'Invoice marked as sent' });
    },
    [updateInvoice, addActivity]
  );

  const remove = useCallback(
    (id: string) => {
      deleteActivities(id);
      deleteInvoice(id);
      toast.info({ title: 'Invoice deleted' });
    },
    [deleteInvoice, deleteActivities]
  );

  const logDownload = useCallback(
    (id: string) => {
      addActivity(id, 'downloaded');
    },
    [addActivity]
  );

  const logView = useCallback(
    (id: string) => {
      addActivity(id, 'viewed');
    },
    [addActivity]
  );

  return { create, duplicate, markPaid, markSent, remove, logDownload, logView };
};
