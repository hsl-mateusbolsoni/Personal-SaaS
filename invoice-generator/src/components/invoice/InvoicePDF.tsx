import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { Invoice } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  companyName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  invoiceNumber: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  invoiceDetails: { textAlign: 'right' },
  billTo: { marginBottom: 30 },
  billToLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  table: { marginBottom: 20 },
  tableHeader: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000',
    paddingBottom: 5, marginBottom: 10, fontWeight: 'bold',
  },
  tableRow: { flexDirection: 'row', marginBottom: 5 },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'right' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'right' },
  totals: { marginLeft: 'auto', width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  grandTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5, marginTop: 5,
    fontWeight: 'bold', fontSize: 12,
  },
});

export const InvoicePDF = ({ invoice }: { invoice: Invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>{invoice.from.name}</Text>
          <Text>{invoice.from.email}</Text>
          <Text>{invoice.from.phone}</Text>
          <Text>{invoice.from.address}</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceNumber}>Invoice {invoice.invoiceNumber}</Text>
          <Text>Date: {invoice.date}</Text>
          <Text>Due Date: {invoice.dueDate}</Text>
          <Text>Status: {invoice.status}</Text>
        </View>
      </View>

      <View style={styles.billTo}>
        <Text style={styles.billToLabel}>Bill To:</Text>
        <Text>{invoice.to.name}</Text>
        <Text>{invoice.to.email}</Text>
        <Text>{invoice.to.phone}</Text>
        <Text>{invoice.to.address}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Description</Text>
          <Text style={styles.col2}>Qty</Text>
          <Text style={styles.col3}>Rate</Text>
          <Text style={styles.col4}>Amount</Text>
        </View>
        {invoice.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{formatCurrency(item.rateCents, invoice.currency)}</Text>
            <Text style={styles.col4}>{formatCurrency(item.amountCents, invoice.currency)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>{formatCurrency(invoice.subtotalCents, invoice.currency)}</Text>
        </View>
        {invoice.discount && invoice.discountAmountCents > 0 && (
          <View style={styles.totalRow}>
            <Text>Discount ({invoice.discount.type === 'percentage' ? `${invoice.discount.value}%` : 'Fixed'}):</Text>
            <Text>-{formatCurrency(invoice.discountAmountCents, invoice.currency)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text>Tax ({invoice.taxRate}%):</Text>
          <Text>{formatCurrency(invoice.taxAmountCents, invoice.currency)}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text>TOTAL:</Text>
          <Text>{formatCurrency(invoice.totalCents, invoice.currency)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const downloadInvoicePDF = async (invoice: Invoice) => {
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
