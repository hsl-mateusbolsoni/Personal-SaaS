import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useActivityStore } from '../stores/useActivityStore';
import { toast } from '../utils/toast';
import type { Invoice } from '../types/invoice';
import { ROUTES } from '../config/routes';

export const useInvoiceActions = () => {
  const navigate = useNavigate();
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
  const addActivity = useActivityStore((s) => s.addActivity);
  const deleteActivities = useActivityStore((s) => s.deleteActivitiesForInvoice);

  const create = useCallback(
    async (draft: Partial<Invoice>) => {
      const invoice = await invoiceService.createInvoice(draft);
      addActivity(invoice.id, 'created', `Invoice ${invoice.invoiceNumber} created`);
      toast.success({ title: 'Invoice created' });
      navigate(ROUTES.INVOICE_PREVIEW(invoice.id));
      return invoice;
    },
    [navigate, addActivity]
  );

  const duplicate = useCallback(
    async (id: string, originalNumber: string) => {
      const invoice = await invoiceService.duplicateInvoice(id);
      addActivity(id, 'duplicated', `Duplicated to ${invoice.invoiceNumber}`);
      addActivity(invoice.id, 'created', `Duplicated from ${originalNumber}`);
      toast.success({ title: 'Invoice duplicated' });
      navigate(ROUTES.INVOICE_EDIT(invoice.id));
      return invoice;
    },
    [navigate, addActivity]
  );

  const markPaid = useCallback(
    async (id: string) => {
      await invoiceService.markAsPaid(id);
      addActivity(id, 'paid');
      toast.success({ title: 'Invoice marked as paid' });
    },
    [addActivity]
  );

  const markSent = useCallback(
    async (id: string) => {
      await invoiceService.markAsSent(id);
      addActivity(id, 'sent');
      toast.info({ title: 'Invoice marked as sent' });
    },
    [addActivity]
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
