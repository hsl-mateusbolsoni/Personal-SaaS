import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice } from '../types/invoice';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
      updateInvoice: (id, updates) => set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
        ),
      })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) })),
      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),
    }),
    { name: 'invoice-generator-v1:invoices', version: 1 }
  )
);
