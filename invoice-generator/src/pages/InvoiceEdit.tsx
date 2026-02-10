import { Box, Text, Grid, GridItem, Show } from '@chakra-ui/react';
import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { WYSIWYGEditor } from '../components/invoice/WYSIWYGEditor';
import type { VisibilitySettings } from '../components/invoice/WYSIWYGEditor';
import { EditorSidebar } from '../components/invoice/EditorSidebar';
import { StickyInvoiceFooter } from '../components/invoice/StickyInvoiceFooter';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { calculateInvoiceTotals } from '../utils/currency';
import { toast } from '../utils/toast';
import { ROUTES } from '../config/routes';
import type { Invoice } from '../types/invoice';
import type { CurrencyCode } from '../types/currency';

export const InvoiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoice = useInvoiceStore((s) => s.invoices.find((i) => i.id === id));
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const settings = useSettingsStore((s) => s.settings);
  const submitRef = useRef<(() => void) | null>(null);
  const addItemRef = useRef<(() => void) | null>(null);

  const [totalCents, setTotalCents] = useState(invoice?.totalCents || 0);
  const [currency, setCurrency] = useState<CurrencyCode>(invoice?.currency || settings.defaultCurrency);
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? settings.defaultTaxRate);
  const [discount, setDiscount] = useState<Invoice['discount']>(invoice?.discount || null);
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    showLogo: true,
    showBusinessId: !!settings.businessId,
    showBankDetails: !!(settings.bankDetails?.bankName || settings.bankDetails?.iban),
    showTax: (invoice?.taxRate ?? settings.defaultTaxRate) > 0,
    showDiscount: !!invoice?.discount,
    showNotes: !!invoice?.metadata?.notes,
  });

  const handleAddItem = useCallback(() => {
    addItemRef.current?.();
  }, []);

  if (!invoice) {
    return (
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Text>Invoice not found.</Text>
      </Box>
    );
  }

  const handleSubmit = (draft: Partial<Invoice>) => {
    const totals = calculateInvoiceTotals(draft.items || [], draft.taxRate || 0, draft.discount || null);
    updateInvoice(invoice.id, { ...draft, ...totals });
    toast.success({ title: 'Invoice updated' });
    navigate(ROUTES.INVOICE_PREVIEW(invoice.id));
  };

  return (
    <>
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <PageHeader
          title="Edit Invoice"
          subtitle="Click any text to edit inline"
          backPath={ROUTES.INVOICE_PREVIEW(invoice.id)}
        />

        <Grid templateColumns={{ base: '1fr', lg: '1fr 320px' }} gap={6}>
          <GridItem>
            <Box
              bg="brand.100"
              borderRadius="xl"
              p={6}
              mb={24}
              overflowX="auto"
            >
              <WYSIWYGEditor
                initial={invoice}
                visibility={visibility}
                currency={currency}
                taxRate={taxRate}
                discount={discount}
                onSubmitRef={(fn) => { submitRef.current = fn; }}
                onSubmit={handleSubmit}
                onTotalChange={setTotalCents}
                onAddItemRef={(fn) => { addItemRef.current = fn; }}
              />
            </Box>
          </GridItem>

          <Show above="lg">
            <GridItem>
              <EditorSidebar
                visibility={visibility}
                onVisibilityChange={setVisibility}
                currency={currency}
                onCurrencyChange={setCurrency}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
                discount={discount}
                onDiscountChange={setDiscount}
                onAddItem={handleAddItem}
              />
            </GridItem>
          </Show>
        </Grid>
      </Box>

      <StickyInvoiceFooter
        totalCents={totalCents}
        currency={currency}
        onSubmit={() => submitRef.current?.()}
        submitLabel="Save Changes"
      />
    </>
  );
};
