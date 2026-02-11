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
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Spacing: 4, 8, 16, 24 (consistent scale)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
  },
  topSection: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  textL: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111',
  },
  textM: {
    fontSize: 10,
    fontWeight: 600,
    color: '#111',
  },
  label: {
    fontSize: 8,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  text: {
    fontSize: 8,
    color: '#555',
    marginTop: 2,
  },
  textMuted: {
    fontSize: 8,
    color: '#888',
    marginTop: 2,
  },
  invoiceDetails: {
    textAlign: 'right',
  },
  section: {
    marginBottom: 16,
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 8,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'right' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'right' },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totals: {
    width: 160,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  discountText: {
    fontSize: 8,
    color: '#16a34a',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 6,
    marginTop: 4,
  },
  notes: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  // Merge visibility settings with defaults to ensure all properties exist
  const visibility: InvoiceVisibility = {
    ...DEFAULT_VISIBILITY,
    ...(invoice.visibility || visibilityProp || {}),
  };

  const hasBankDetails = visibility.showBankDetails && bankDetails && (
    bankDetails.bankName ||
    bankDetails.accountNumber ||
    bankDetails.iban
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* TOP SECTION */}
        <View style={styles.topSection}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.textL}>{invoice.from.name}</Text>
              {visibility.showBusinessId && businessId && (
                <Text style={styles.textMuted}>{businessId}</Text>
              )}
              <Text style={[styles.text, { marginTop: 8 }]}>{invoice.from.email}</Text>
              <Text style={styles.text}>{invoice.from.phone}</Text>
              <Text style={styles.text}>{invoice.from.address}</Text>
            </View>
            <View style={styles.invoiceDetails}>
              <Text style={styles.textL}>{invoice.invoiceNumber}</Text>
              <Text style={[styles.text, { marginTop: 8 }]}>Issued {invoice.date}</Text>
              <Text style={styles.text}>Due {invoice.dueDate}</Text>
            </View>
          </View>

          {/* Bill To */}
          <View style={styles.section}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.textM}>{invoice.to.name}</Text>
            <Text style={styles.text}>{invoice.to.email}</Text>
            <Text style={styles.text}>{invoice.to.phone}</Text>
            <Text style={styles.text}>{invoice.to.address}</Text>
          </View>

          {/* Payment Details */}
          {hasBankDetails && (
            <View style={styles.section}>
              <Text style={styles.label}>
                Payment{paymentType ? ` — ${PAYMENT_TYPE_LABELS[paymentType]}` : ''}
              </Text>
              {bankDetails?.bankName && <Text style={styles.text}>{bankDetails.bankName}</Text>}
              {bankDetails?.accountName && <Text style={styles.text}>{bankDetails.accountName}</Text>}
              {bankDetails?.accountNumber && <Text style={styles.text}>Account: {bankDetails.accountNumber}</Text>}
              {bankDetails?.routingNumber && <Text style={styles.text}>Routing: {bankDetails.routingNumber}</Text>}
              {bankDetails?.iban && <Text style={styles.text}>IBAN: {bankDetails.iban}</Text>}
              {bankDetails?.swiftBic && <Text style={styles.text}>SWIFT: {bankDetails.swiftBic}</Text>}
            </View>
          )}
        </View>

        {/* BOTTOM SECTION */}
        <View>
          {/* Line Items */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>Rate</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[{ fontSize: 8, color: '#333' }, styles.col1]}>{item.description}</Text>
                <Text style={[{ fontSize: 8, color: '#333' }, styles.col2]}>{item.quantity}</Text>
                <Text style={[{ fontSize: 8, color: '#333' }, styles.col3]}>{formatCurrency(item.rateCents, invoice.currency)}</Text>
                <Text style={[{ fontSize: 8, color: '#333' }, styles.col4]}>{formatCurrency(item.amountCents, invoice.currency)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: '#555' }}>Subtotal</Text>
                <Text style={{ fontSize: 8, color: '#555' }}>{formatCurrency(invoice.subtotalCents, invoice.currency)}</Text>
              </View>
              {visibility.showDiscount && invoice.discount && invoice.discountAmountCents > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.discountText}>
                    Discount{invoice.discount.type === 'percentage' ? ` ${invoice.discount.value}%` : ''}
                  </Text>
                  <Text style={styles.discountText}>-{formatCurrency(invoice.discountAmountCents, invoice.currency)}</Text>
                </View>
              )}
              {visibility.showTax && invoice.taxRate > 0 && (
                <View style={styles.totalRow}>
                  <Text style={{ fontSize: 8, color: '#555' }}>Tax {invoice.taxRate}%</Text>
                  <Text style={{ fontSize: 8, color: '#555' }}>{formatCurrency(invoice.taxAmountCents, invoice.currency)}</Text>
                </View>
              )}
              <View style={styles.grandTotal}>
                <Text style={styles.textM}>Total</Text>
                <Text style={styles.textM}>{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {visibility.showNotes && invoice.metadata?.notes && (
            <View style={styles.notes}>
              <Text style={styles.label}>Notes</Text>
              <Text style={{ fontSize: 8, color: '#555' }}>{invoice.metadata.notes}</Text>
            </View>
          )}
        </View>
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
    // Pass visibility explicitly - use invoice's visibility or defaults
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
