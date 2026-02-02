import { z } from 'zod';

export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required').max(200),
  quantity: z.number().positive('Quantity must be positive'),
  rateCents: z.number().nonnegative('Rate cannot be negative'),
  amountCents: z.number(),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  from: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  to: z.object({
    clientId: z.string().optional(),
    name: z.string().min(1, 'Client name is required'),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  items: z.array(LineItemSchema).min(1, 'At least one item is required'),
  currency: z.string(),
  subtotalCents: z.number(),
  discount: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number(),
  }).nullable(),
  discountAmountCents: z.number(),
  taxRate: z.number().min(0).max(100),
  taxAmountCents: z.number(),
  totalCents: z.number(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).refine(
  (data) => new Date(data.dueDate) >= new Date(data.date),
  { message: 'Due date must be on or after invoice date', path: ['dueDate'] }
);

export const ClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string(),
  address: z.string(),
});
