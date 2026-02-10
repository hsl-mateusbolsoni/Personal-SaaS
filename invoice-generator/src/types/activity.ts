export type ActivityType =
  | 'created'
  | 'updated'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'viewed'
  | 'downloaded'
  | 'duplicated';

export interface ActivityLog {
  id: string;
  invoiceId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  created: 'Invoice created',
  updated: 'Invoice updated',
  sent: 'Marked as sent',
  paid: 'Marked as paid',
  overdue: 'Marked as overdue',
  viewed: 'Invoice viewed',
  downloaded: 'PDF downloaded',
  duplicated: 'Invoice duplicated',
};
