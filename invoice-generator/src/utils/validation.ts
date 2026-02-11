import { z } from 'zod';

// Helper for optional email (empty string or valid email)
const optionalEmail = z.string().email('Invalid email').or(z.literal(''));

// Visibility settings schema
export const VisibilitySchema = z.object({
  showLogo: z.boolean(),
  showBusinessId: z.boolean(),
  showBankDetails: z.boolean(),
  showTax: z.boolean(),
  showDiscount: z.boolean(),
  showNotes: z.boolean(),
});

export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required').max(200),
  quantity: z.number().positive('Quantity must be positive'),
  rateCents: z.number().nonnegative('Rate cannot be negative'),
  amountCents: z.number(),
});

// Schema for validating line items before adding (without id requirement)
export const LineItemInputSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200),
  quantity: z.number().positive('Quantity must be greater than 0'),
  rateCents: z.number().nonnegative('Rate cannot be negative'),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  from: z.object({
    name: z.string().min(1, 'Business name is required'),
    email: optionalEmail,
    phone: z.string(),
    address: z.string(),
  }),
  to: z.object({
    clientId: z.string().optional(),
    name: z.string().min(1, 'Client name is required'),
    email: optionalEmail,
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
  visibility: VisibilitySchema.optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).refine(
  (data) => new Date(data.dueDate) >= new Date(data.date),
  { message: 'Due date must be on or after invoice date', path: ['dueDate'] }
);

// Schema for validating invoice draft before submission (less strict)
export const InvoiceDraftSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  date: z.string().min(1, 'Date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  from: z.object({
    name: z.string().min(1, 'Business name is required'),
    email: optionalEmail,
    phone: z.string(),
    address: z.string(),
  }),
  to: z.object({
    clientId: z.string().optional(),
    name: z.string().min(1, 'Client name is required'),
    email: optionalEmail,
    phone: z.string(),
    address: z.string(),
  }),
  items: z.array(z.object({
    id: z.string(),
    description: z.string(),
    quantity: z.number(),
    rateCents: z.number(),
    amountCents: z.number(),
  })).min(1, 'At least one line item is required'),
  currency: z.string(),
  taxRate: z.number().min(0).max(100),
  discount: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
  }).nullable(),
  visibility: VisibilitySchema.optional(),
}).refine(
  (data) => {
    if (!data.date || !data.dueDate) return true;
    return new Date(data.dueDate) >= new Date(data.date);
  },
  { message: 'Due date must be on or after invoice date', path: ['dueDate'] }
).refine(
  (data) => {
    // At least one item must have a description
    return data.items.some(item => item.description.trim().length > 0);
  },
  { message: 'At least one item must have a description', path: ['items'] }
);

export const ClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: optionalEmail,
  phone: z.string(),
  address: z.string(),
});

// Type for validation errors
export interface ValidationErrors {
  [key: string]: string | undefined;
}

// Validate invoice draft and return errors
export function validateInvoiceDraft(data: unknown): {
  success: true;
  data: z.infer<typeof InvoiceDraftSchema>;
} | {
  success: false;
  errors: ValidationErrors;
} {
  const result = InvoiceDraftSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationErrors = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}

// Validate a single line item input
export function validateLineItemInput(data: unknown): {
  success: true;
  data: z.infer<typeof LineItemInputSchema>;
} | {
  success: false;
  errors: ValidationErrors;
} {
  const result = LineItemInputSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationErrors = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }

  return { success: false, errors };
}

// Get first error message for a field
export function getFieldError(errors: ValidationErrors, field: string): string | undefined {
  return errors[field];
}

// Check if there are any errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Get all error messages as array
export function getErrorMessages(errors: ValidationErrors): string[] {
  return Object.values(errors).filter((msg): msg is string => msg !== undefined);
}
