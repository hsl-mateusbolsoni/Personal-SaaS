import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useState, useRef, useCallback } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { WYSIWYGEditor } from '../components/invoice/WYSIWYGEditor';
import type { VisibilitySettings } from '../components/invoice/WYSIWYGEditor';
import { EditorSidebar } from '../components/invoice/EditorSidebar';
import { MobileInvoiceForm } from '../components/invoice/MobileInvoiceForm';
import { StickyInvoiceFooter } from '../components/invoice/StickyInvoiceFooter';
import { useInvoiceActions } from '../hooks/useInvoiceActions';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ROUTES } from '../config/routes';
import type { Invoice } from '../types/invoice';
import type { CurrencyCode } from '../types/currency';

export const InvoiceCreate = () => {
  const { create } = useInvoiceActions();
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

  const [totalCents, setTotalCents] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>(appSettings.defaultCurrency);
  const [taxRate, setTaxRate] = useState(appSettings.defaultTaxRate);
  const [discount, setDiscount] = useState<Invoice['discount']>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    showLogo: true,
    showBusinessId: !!settings.businessId,
    showBankDetails: !!hasPaymentMethod,
    showTax: appSettings.defaultTaxRate > 0,
    showDiscount: false,
    showNotes: false,
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

  return (
    <>
      {/* Mobile View - visible below lg breakpoint */}
      <Box display={{ base: 'block', lg: 'none' }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
          <PageHeader
            title="New Invoice"
            subtitle="Fill in the details below"
            backPath={ROUTES.DASHBOARD}
          />
          <MobileInvoiceForm
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
            onSubmit={(draft) => create(draft)}
            onTotalChange={setTotalCents}
            submitLabel="Create Invoice"
          />
        </Box>
      </Box>

      {/* Desktop View - visible at lg breakpoint and above */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
          <PageHeader
            title="New Invoice"
            subtitle="Click any text to edit inline"
            backPath={ROUTES.DASHBOARD}
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
                  visibility={visibility}
                  currency={currency}
                  taxRate={taxRate}
                  discount={discount}
                  onSubmitRef={(fn) => { submitRef.current = fn; }}
                  onSubmit={(draft) => create(draft)}
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
          submitLabel="Create Invoice"
        />
      </Box>
    </>
  );
};
