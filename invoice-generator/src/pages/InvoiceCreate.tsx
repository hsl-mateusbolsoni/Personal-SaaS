import { Box, Grid, GridItem, Show } from '@chakra-ui/react';
import { useState, useRef, useCallback } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { WYSIWYGEditor } from '../components/invoice/WYSIWYGEditor';
import type { VisibilitySettings } from '../components/invoice/WYSIWYGEditor';
import { EditorSidebar } from '../components/invoice/EditorSidebar';
import { StickyInvoiceFooter } from '../components/invoice/StickyInvoiceFooter';
import { useInvoiceActions } from '../hooks/useInvoiceActions';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ROUTES } from '../config/routes';
import type { Invoice } from '../types/invoice';
import type { CurrencyCode } from '../types/currency';

export const InvoiceCreate = () => {
  const { create } = useInvoiceActions();
  const settings = useSettingsStore((s) => s.settings);
  const submitRef = useRef<(() => void) | null>(null);
  const addItemRef = useRef<(() => void) | null>(null);

  const [totalCents, setTotalCents] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>(settings.defaultCurrency);
  const [taxRate, setTaxRate] = useState(settings.defaultTaxRate);
  const [discount, setDiscount] = useState<Invoice['discount']>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    showLogo: true,
    showBusinessId: !!settings.businessId,
    showBankDetails: !!(settings.bankDetails?.bankName || settings.bankDetails?.iban),
    showTax: settings.defaultTaxRate > 0,
    showDiscount: false,
    showNotes: false,
  });

  const handleAddItem = useCallback(() => {
    addItemRef.current?.();
  }, []);

  return (
    <>
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <PageHeader
          title="New Invoice"
          subtitle="Click any text to edit inline"
          backPath={ROUTES.DASHBOARD}
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
        submitLabel="Create Invoice"
      />
    </>
  );
};
