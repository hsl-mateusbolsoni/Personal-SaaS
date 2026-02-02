export interface Client {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  lastUsed: string;
  invoiceCount: number;
}
