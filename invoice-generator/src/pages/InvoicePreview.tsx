import { useState } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { PencilSimple, DownloadSimple, Check, ClockCounterClockwise } from 'phosphor-react';
import { PageHeader } from '../components/layout/PageHeader';
import { InvoiceCanvas } from '../components/invoice/InvoiceCanvas';
import { downloadInvoicePDF } from '../components/invoice/InvoicePDF';
import { ActivityLogDrawer } from '../components/invoice/ActivityLogDrawer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useInvoiceStore } from '../stores/useInvoiceStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useInvoiceActions } from '../hooks/useInvoiceActions';
import { toast } from '../utils/toast';
import { ROUTES } from '../config/routes';

export const InvoicePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoice = useInvoiceStore((s) => s.invoices.find((i) => i.id === id));
  const settings = useSettingsStore((s) => s.settings);
  const { markPaid, markSent, logDownload } = useInvoiceActions();
  const [isDownloading, setIsDownloading] = useState(false);
  const { isOpen: isActivityOpen, onOpen: onActivityOpen, onClose: onActivityClose } = useDisclosure();

  if (!invoice) {
    return (
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        Invoice not found.
      </Box>
    );
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadInvoicePDF(invoice);
      logDownload(invoice.id);
      toast.success({ title: 'PDF downloaded' });
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error({
        title: 'Download failed',
        description: 'There was an error generating the PDF. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
      <PageHeader
        title="Invoice Details"
        subtitle={`${invoice.invoiceNumber} · ${invoice.to.name}`}
        backPath={ROUTES.DASHBOARD}
        titleExtra={<StatusBadge status={invoice.status} />}
        actions={
          <>
            {invoice.status === 'draft' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => markSent(invoice.id)}
              >
                Mark Sent
              </Button>
            )}
            {invoice.status !== 'paid' && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Check size={16} />}
                onClick={() => markPaid(invoice.id)}
              >
                Mark Paid
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ClockCounterClockwise size={16} />}
              onClick={onActivityOpen}
            >
              Activity
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<PencilSimple size={16} />}
              onClick={() => navigate(ROUTES.INVOICE_EDIT(invoice.id))}
            >
              Edit
            </Button>
            <Button
              size="sm"
              leftIcon={<DownloadSimple size={16} />}
              onClick={handleDownload}
              isLoading={isDownloading}
              loadingText="Generating..."
            >
              Download PDF
            </Button>
          </>
        }
      />

      {/* Invoice Canvas */}
      <Box
        bg="brand.100"
        borderRadius="xl"
        p={6}
        overflowX="auto"
      >
        <InvoiceCanvas
          invoice={invoice}
          businessId={settings.businessId}
          paymentMethod={settings.paymentMethods.find((m) => m.isDefault)}
        />
      </Box>

      <ActivityLogDrawer
        isOpen={isActivityOpen}
        onClose={onActivityClose}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoiceNumber}
      />
    </Box>
  );
};
