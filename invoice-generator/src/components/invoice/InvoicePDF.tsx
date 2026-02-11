import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import type { Invoice, InvoiceVisibility } from '../../types/invoice';
import type { BankDetails, PaymentType } from '../../types/settings';
import { formatCurrency } from '../../utils/currency';
import { PAYMENT_TYPE_LABELS } from '../../config/payments';

const DEFAULT_VISIBILITY: InvoiceVisibility = {
  showLogo: true,
  showBusinessId: true,
  showBankDetails: true,
  showTax: true,
  showDiscount: true,
  showNotes: true,
};

// Register Roboto font (TTF format required by react-pdf)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Stripe-inspired color palette
const colors = {
  primary: '#635bff', // Stripe purple
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  background: '#f9fafb',
  success: '#10b981',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Roboto',
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.white,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  brandSection: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  brandId: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 8,
  },
  brandContact: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 300,
    color: colors.textMuted,
    textAlign: 'right',
    letterSpacing: 2,
  },
  // Invoice meta box
  metaBox: {
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 16,
    marginBottom: 32,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 500,
  },
  metaValueLarge: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 700,
  },
  // Parties section
  partiesSection: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 40,
  },
  partyColumn: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  partyName: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.text,
    marginBottom: 4,
  },
  partyDetail: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  // Table
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 500,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableCell: {
    fontSize: 10,
    color: colors.text,
  },
  tableCellSecondary: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colRate: { flex: 1.5, textAlign: 'right' },
  colAmount: { flex: 1.5, textAlign: 'right' },
  // Totals
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  totalsBox: {
    width: 220,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 10,
    color: colors.text,
  },
  totalDiscountValue: {
    fontSize: 10,
    color: colors.success,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: colors.text,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.text,
  },
  // Payment section
  paymentSection: {
    backgroundColor: colors.background,
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: 500,
    color: colors.text,
    marginBottom: 8,
  },
  paymentDetail: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  // Notes
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  notesLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  businessId?: string;
  paymentType?: PaymentType;
  bankDetails?: BankDetails;
  visibility?: InvoiceVisibility;
}

export const InvoicePDF = ({ invoice, businessId, paymentType, bankDetails, visibility: visibilityProp }: InvoicePDFProps) => {
  const visibility: InvoiceVisibility = {
    ...DEFAULT_VISIBILITY,
    ...(invoice.visibility || visibilityProp || {}),
  };

  const hasBankDetails = visibility.showBankDetails && bankDetails && (
    bankDetails.bankName ||
    bankDetails.accountNumber ||
    bankDetails.iban
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>{invoice.from.name}</Text>
            {visibility.showBusinessId && businessId && (
              <Text style={styles.brandId}>{businessId}</Text>
            )}
            <Text style={styles.brandContact}>
              {[invoice.from.email, invoice.from.phone].filter(Boolean).join(' • ')}
            </Text>
            {invoice.from.address && (
              <Text style={styles.brandContact}>{invoice.from.address}</Text>
            )}
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Invoice Meta Box */}
        <View style={styles.metaBox}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Issue Date</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.date)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Due Date</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.metaRowLast}>
            <Text style={styles.metaLabel}>Amount Due</Text>
            <Text style={styles.metaValueLarge}>{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.partiesSection}>
          <View style={styles.partyColumn}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{invoice.to.name}</Text>
            {invoice.to.email && <Text style={styles.partyDetail}>{invoice.to.email}</Text>}
            {invoice.to.phone && <Text style={styles.partyDetail}>{invoice.to.phone}</Text>}
            {invoice.to.address && <Text style={styles.partyDetail}>{invoice.to.address}</Text>}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Unit Price</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.tableCellSecondary, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCellSecondary, styles.colRate]}>{formatCurrency(item.rateCents, invoice.currency)}</Text>
              <Text style={[styles.tableCell, styles.colAmount]}>{formatCurrency(item.amountCents, invoice.currency)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.subtotalCents, invoice.currency)}</Text>
            </View>
            {visibility.showDiscount && invoice.discount && invoice.discountAmountCents > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount{invoice.discount.type === 'percentage' ? ` (${invoice.discount.value}%)` : ''}
                </Text>
                <Text style={styles.totalDiscountValue}>-{formatCurrency(invoice.discountAmountCents, invoice.currency)}</Text>
              </View>
            )}
            {visibility.showTax && invoice.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmountCents, invoice.currency)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        {hasBankDetails && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>
              Payment Details{paymentType ? ` — ${PAYMENT_TYPE_LABELS[paymentType]}` : ''}
            </Text>
            {bankDetails?.bankName && <Text style={styles.paymentDetail}>{bankDetails.bankName}</Text>}
            {bankDetails?.accountName && <Text style={styles.paymentDetail}>Account Name: {bankDetails.accountName}</Text>}
            {bankDetails?.accountNumber && <Text style={styles.paymentDetail}>Account Number: {bankDetails.accountNumber}</Text>}
            {bankDetails?.routingNumber && <Text style={styles.paymentDetail}>Routing Number: {bankDetails.routingNumber}</Text>}
            {bankDetails?.iban && <Text style={styles.paymentDetail}>IBAN: {bankDetails.iban}</Text>}
            {bankDetails?.swiftBic && <Text style={styles.paymentDetail}>SWIFT/BIC: {bankDetails.swiftBic}</Text>}
          </View>
        )}

        {/* Notes */}
        {visibility.showNotes && invoice.metadata?.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.metadata.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

const getSettingsForPDF = () => {
  try {
    const stored = localStorage.getItem('invoice-generator-v1:settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        businessId: parsed.state?.settings?.businessId || '',
        paymentType: parsed.state?.settings?.paymentType || 'bank_transfer',
        bankDetails: parsed.state?.settings?.bankDetails || null,
      };
    }
  } catch (e) {
    console.error('Failed to get settings for PDF:', e);
  }
  return { businessId: '', paymentType: 'bank_transfer' as PaymentType, bankDetails: null };
};

export const downloadInvoicePDF = async (invoice: Invoice) => {
  try {
    const { businessId, paymentType, bankDetails } = getSettingsForPDF();
    const visibility = invoice.visibility || DEFAULT_VISIBILITY;
    const blob = await pdf(
      <InvoicePDF
        invoice={invoice}
        businessId={businessId}
        paymentType={paymentType}
        bankDetails={bankDetails}
        visibility={visibility}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
