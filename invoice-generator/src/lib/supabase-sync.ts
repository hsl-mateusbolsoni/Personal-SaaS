import { supabase } from './supabase';
import type { Client } from '../types/client';
import type { Invoice } from '../types/invoice';
import type { CompanySettings, AppSettings } from '../types/settings';
import type { ActivityLog } from '../types/activity';

// ============================================
// CLIENTS SYNC
// ============================================
export async function fetchClients(): Promise<Client[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    createdAt: row.created_at,
    lastUsed: row.last_used || row.created_at,
    invoiceCount: row.invoice_count || 0,
  }));
}

export async function syncClient(client: Client, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('clients')
    .upsert({
      id: client.id,
      user_id: userId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      invoice_count: client.invoiceCount,
      last_used: client.lastUsed,
      created_at: client.createdAt,
    }, { onConflict: 'id' });

  if (error) console.error('Error syncing client:', error);
}

export async function deleteClientFromCloud(clientId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) console.error('Error deleting client:', error);
}

// ============================================
// INVOICES SYNC
// ============================================
export async function fetchInvoices(): Promise<Invoice[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    invoiceNumber: row.invoice_number,
    date: row.date,
    dueDate: row.due_date,
    status: row.status,
    from: row.from_info,
    to: row.to_info,
    items: row.items || [],
    currency: row.currency,
    subtotalCents: row.subtotal_cents,
    discount: row.discount,
    discountAmountCents: row.discount_amount_cents,
    taxRate: row.tax_rate,
    taxAmountCents: row.tax_amount_cents,
    totalCents: row.total_cents,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function syncInvoice(invoice: Invoice, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('invoices')
    .upsert({
      id: invoice.id,
      user_id: userId,
      invoice_number: invoice.invoiceNumber,
      date: invoice.date,
      due_date: invoice.dueDate,
      status: invoice.status,
      currency: invoice.currency,
      tax_rate: invoice.taxRate,
      from_info: invoice.from,
      to_info: invoice.to,
      items: invoice.items,
      discount: invoice.discount,
      subtotal_cents: invoice.subtotalCents,
      discount_amount_cents: invoice.discountAmountCents,
      tax_amount_cents: invoice.taxAmountCents,
      total_cents: invoice.totalCents,
      metadata: invoice.metadata,
      created_at: invoice.createdAt,
      updated_at: invoice.updatedAt,
    }, { onConflict: 'id' });

  if (error) console.error('Error syncing invoice:', error);
}

export async function deleteInvoiceFromCloud(invoiceId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId);

  if (error) console.error('Error deleting invoice:', error);
}

// ============================================
// SETTINGS SYNC
// ============================================
export async function fetchCompanySettings(): Promise<CompanySettings | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is ok
      console.error('Error fetching company settings:', error);
    }
    return null;
  }

  return {
    userId: data.user_id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    businessId: data.business_id || '',
    paymentMethods: data.payment_methods || [],
    lastUsedClientId: data.last_used_client_id,
  };
}

export async function syncCompanySettings(settings: CompanySettings, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('company_settings')
    .upsert({
      user_id: userId,
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      business_id: settings.businessId,
      payment_methods: settings.paymentMethods,
      last_used_client_id: settings.lastUsedClientId,
    }, { onConflict: 'user_id' });

  if (error) console.error('Error syncing company settings:', error);
}

export async function fetchAppSettings(): Promise<AppSettings | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching app settings:', error);
    }
    return null;
  }

  return {
    dateFormat: data.date_format || 'MM/DD/YYYY',
    weekStartsOn: data.week_starts_on || 'sunday',
    autoSave: data.auto_save ?? true,
    showDueDateWarnings: data.show_due_date_warnings ?? true,
    defaultTaxRate: data.default_tax_rate || 0,
    defaultCurrency: data.default_currency || 'USD',
    invoiceNumberPrefix: data.invoice_number_prefix || 'INV-',
    nextInvoiceNumber: data.next_invoice_number || 1,
  };
}

export async function syncAppSettings(settings: AppSettings, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('app_settings')
    .upsert({
      user_id: userId,
      date_format: settings.dateFormat,
      week_starts_on: settings.weekStartsOn,
      auto_save: settings.autoSave,
      show_due_date_warnings: settings.showDueDateWarnings,
      default_tax_rate: settings.defaultTaxRate,
      default_currency: settings.defaultCurrency,
      invoice_number_prefix: settings.invoiceNumberPrefix,
      next_invoice_number: settings.nextInvoiceNumber,
    }, { onConflict: 'user_id' });

  if (error) console.error('Error syncing app settings:', error);
}

// ============================================
// ACTIVITIES SYNC
// ============================================
export async function fetchActivities(): Promise<ActivityLog[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    invoiceId: row.invoice_id,
    type: row.type,
    description: row.description || '',
    metadata: row.metadata,
    createdAt: row.created_at,
  }));
}

export async function syncActivity(activity: ActivityLog, userId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('activities')
    .upsert({
      id: activity.id,
      user_id: userId,
      invoice_id: activity.invoiceId,
      type: activity.type,
      description: activity.description,
      metadata: activity.metadata,
      created_at: activity.createdAt,
    }, { onConflict: 'id' });

  if (error) console.error('Error syncing activity:', error);
}

// ============================================
// BULK SYNC (for initial migration)
// ============================================
export async function migrateLocalDataToCloud(
  userId: string,
  clients: Client[],
  invoices: Invoice[],
  companySettings: CompanySettings,
  appSettings: AppSettings,
  activities: ActivityLog[]
): Promise<void> {
  if (!supabase) return;

  console.log('Migrating local data to cloud...');

  // Sync settings first
  await syncCompanySettings(companySettings, userId);
  await syncAppSettings(appSettings, userId);

  // Sync clients
  for (const client of clients) {
    await syncClient(client, userId);
  }

  // Sync invoices
  for (const invoice of invoices) {
    await syncInvoice(invoice, userId);
  }

  // Sync activities
  for (const activity of activities) {
    await syncActivity(activity, userId);
  }

  console.log('Migration complete!');
}
