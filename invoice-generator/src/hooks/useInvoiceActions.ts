import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { invoiceService } from '../services';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import type { Invoice } from '../types/invoice';
import { ROUTES } from '../config/routes';

export const useInvoiceActions = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);

  const create = useCallback(
    async (draft: Partial<Invoice>) => {
      const invoice = await invoiceService.createInvoice(draft);
      toast({ title: 'Invoice created', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
      navigate(ROUTES.INVOICE_PREVIEW(invoice.id));
      return invoice;
    },
    [navigate, toast]
  );

  const duplicate = useCallback(
    async (id: string) => {
      const invoice = await invoiceService.duplicateInvoice(id);
      toast({ title: 'Invoice duplicated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
      navigate(ROUTES.INVOICE_EDIT(invoice.id));
      return invoice;
    },
    [navigate, toast]
  );

  const markPaid = useCallback(
    async (id: string) => {
      await invoiceService.markAsPaid(id);
      toast({ title: 'Invoice marked as paid', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    },
    [toast]
  );

  const markSent = useCallback(
    async (id: string) => {
      await invoiceService.markAsSent(id);
      toast({ title: 'Invoice marked as sent', status: 'info', duration: 2000, isClosable: true, position: 'top-right' });
    },
    [toast]
  );

  const remove = useCallback(
    (id: string) => {
      deleteInvoice(id);
      toast({ title: 'Invoice deleted', status: 'info', duration: 2000, isClosable: true, position: 'top-right' });
    },
    [deleteInvoice, toast]
  );

  return { create, duplicate, markPaid, markSent, remove };
};
