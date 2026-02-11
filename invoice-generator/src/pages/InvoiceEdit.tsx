import { Box, Text, Grid, GridItem } from '@chakra-ui/react';
import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { WYSIWYGEditor } from '../components/invoice/WYSIWYGEditor';
import type { VisibilitySettings } from '../components/invoice/WYSIWYGEditor';
import { EditorSidebar } from '../components/invoice/EditorSidebar';
import { MobileInvoiceForm } from '../components/invoice/MobileInvoiceForm';
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
  const appSettings = useSettingsStore((s) => s.appSettings);
  const submitRef = useRef<(() => void) | null>(null);
  const addItemRef = useRef<(() => void) | null>(null);

  const defaultPayment = settings.paymentMethods.find((m) => m.isDefault);
  const hasPaymentMethod = defaultPayment && (
    defaultPayment.bankTransfer?.bankName ||
    defaultPayment.pix?.pixKey ||
    defaultPayment.paypal?.email ||
    defaultPayment.wise?.email ||
    defaultPayment.crypto?.walletAddress ||
    defaultPayment.other?.instructions
  );

  const [totalCents, setTotalCents] = useState(invoice?.totalCents || 0);
  const [currency, setCurrency] = useState<CurrencyCode>(invoice?.currency || appSettings.defaultCurrency);
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? appSettings.defaultTaxRate);
  const [discount, setDiscount] = useState<Invoice['discount']>(invoice?.discount || null);
  const [visibility, setVisibility] = useState<VisibilitySettings>(() => {
    // Use saved visibility from invoice if available, otherwise derive from data
    if (invoice?.visibility) {
      return invoice.visibility;
    }
    return {
      showLogo: true,
      showBusinessId: !!settings.businessId,
      showBankDetails: !!hasPaymentMethod,
      showTax: (invoice?.taxRate ?? appSettings.defaultTaxRate) > 0,
      showDiscount: !!invoice?.discount,
      showNotes: !!invoice?.metadata?.notes,
    };
  });

  const handleAddItem = useCallback(() => {
    addItemRef.current?.();
  }, []);

  const handleShowTaxChange = (show: boolean) => {
    setVisibility((v) => ({ ...v, showTax: show }));
  };

  const handleShowDiscountChange = (show: boolean) => {
    setVisibility((v) => ({ ...v, showDiscount: show }));
  };

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
      {/* Mobile View - visible below lg breakpoint */}
      <Box display={{ base: 'block', lg: 'none' }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
          <PageHeader
            title="Edit Invoice"
            subtitle="Update the details below"
            backPath={ROUTES.INVOICE_PREVIEW(invoice.id)}
          />
          <MobileInvoiceForm
            initial={invoice}
            currency={currency}
            onCurrencyChange={setCurrency}
            taxRate={taxRate}
            onTaxRateChange={setTaxRate}
            discount={discount}
            onDiscountChange={setDiscount}
            showTax={visibility.showTax}
            onShowTaxChange={handleShowTaxChange}
            showDiscount={visibility.showDiscount}
            onShowDiscountChange={handleShowDiscountChange}
            showLogo={visibility.showLogo}
            showBusinessId={visibility.showBusinessId}
            showBankDetails={visibility.showBankDetails}
            showNotes={visibility.showNotes}
            onSubmit={handleSubmit}
            onTotalChange={setTotalCents}
            submitLabel="Save Changes"
          />
        </Box>
      </Box>

      {/* Desktop View - visible at lg breakpoint and above */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
          <PageHeader
            title="Edit Invoice"
            subtitle="Click any text to edit inline"
            backPath={ROUTES.INVOICE_PREVIEW(invoice.id)}
          />

          <Grid templateColumns="1fr 320px" gap={6}>
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
          </Grid>
        </Box>

        <StickyInvoiceFooter
          totalCents={totalCents}
          currency={currency}
          onSubmit={() => submitRef.current?.()}
          submitLabel="Save Changes"
        />
      </Box>
    </>
  );
};
