export type PaymentType = 'bank_transfer' | 'pix' | 'paypal' | 'wise' | 'crypto' | 'other';

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  iban: string;
}

export interface PixDetails {
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  recipientName: string;
}

export interface PaypalDetails {
  email: string;
}

export interface WiseDetails {
  email: string;
}

export interface CryptoDetails {
  walletAddress: string;
  network: string;
  currency: string;
}

export interface OtherDetails {
  label: string;
  instructions: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  isDefault: boolean;
  label?: string;
  bankTransfer?: BankTransferDetails;
  pix?: PixDetails;
  paypal?: PaypalDetails;
  wise?: WiseDetails;
  crypto?: CryptoDetails;
  other?: OtherDetails;
}

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  bank_transfer: 'Bank Transfer',
  pix: 'PIX',
  paypal: 'PayPal',
  wise: 'Wise',
  crypto: 'Cryptocurrency',
  other: 'Other',
};

export const PAYMENT_TYPE_ICONS: Record<PaymentType, string> = {
  bank_transfer: 'Bank',
  pix: 'QrCode',
  paypal: 'PaypalLogo',
  wise: 'CurrencyCircleDollar',
  crypto: 'CurrencyBtc',
  other: 'Wallet',
};

export const getPaymentMethodSummary = (method: PaymentMethod): string => {
  switch (method.type) {
    case 'bank_transfer':
      if (method.bankTransfer?.bankName) {
        const lastFour = method.bankTransfer.accountNumber?.slice(-4);
        return `${method.bankTransfer.bankName}${lastFour ? ` ••••${lastFour}` : ''}`;
      }
      return 'Bank account';
    case 'pix':
      return method.pix?.pixKey || 'PIX key';
    case 'paypal':
      return method.paypal?.email || 'PayPal account';
    case 'wise':
      return method.wise?.email || 'Wise account';
    case 'crypto':
      if (method.crypto?.currency && method.crypto?.network) {
        return `${method.crypto.currency} (${method.crypto.network})`;
      }
      return 'Crypto wallet';
    case 'other':
      return method.other?.label || 'Custom payment';
    default:
      return 'Payment method';
  }
};
