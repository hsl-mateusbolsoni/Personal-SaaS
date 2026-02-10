import { Box, VStack, Text, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Plus, PencilSimple, Buildings, MapPin, Envelope, Phone, IdentificationCard } from 'phosphor-react';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { CompanyInfoDrawer, PaymentMethodDrawer, PaymentMethodCard } from '../components/settings';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useSettingsStore } from '../stores/useSettingsStore';
import { toast } from '../utils/toast';
import type { PaymentMethod } from '../types/payment';

export const BusinessDetails = () => {
  const {
    settings,
    updateSettings,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    markSetupComplete,
  } = useSettingsStore();

  const {
    isOpen: isCompanyOpen,
    onOpen: onCompanyOpen,
    onClose: onCompanyClose,
  } = useDisclosure();

  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null);

  const handleCompanySave = (updates: Partial<typeof settings>) => {
    updateSettings(updates);
    markSetupComplete();
    toast.success({ title: 'Company information saved' });
  };

  const handlePaymentSave = (method: PaymentMethod) => {
    if (editingMethod) {
      updatePaymentMethod(method.id, method);
      toast.success({ title: 'Payment method updated' });
    } else {
      addPaymentMethod(method);
      toast.success({ title: 'Payment method added' });
    }
    setEditingMethod(null);
  };

  const handleEditPayment = (method: PaymentMethod) => {
    setEditingMethod(method);
    onPaymentOpen();
  };

  const handleAddPayment = () => {
    setEditingMethod(null);
    onPaymentOpen();
  };

  const handleDeletePayment = (id: string) => {
    setDeletingMethodId(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (deletingMethodId) {
      removePaymentMethod(deletingMethodId);
      toast.info({ title: 'Payment method removed' });
    }
    setDeletingMethodId(null);
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: typeof Buildings; label: string; value: string }) => (
    <Flex align="flex-start" gap={3}>
      <Box color="brand.400" mt={0.5}>
        <Icon size={16} />
      </Box>
      <Box>
        <Text fontSize="xs" color="brand.400" textTransform="uppercase" fontWeight="500">
          {label}
        </Text>
        <Text fontSize="sm" color="brand.700" whiteSpace="pre-line">
          {value || '—'}
        </Text>
      </Box>
    </Flex>
  );

  return (
    <Container>
      <PageHeader
        title="Business Details"
        subtitle="Your company information and payment methods"
      />

      <VStack gap={6} align="stretch">
        {/* Company Information */}
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100" overflow="hidden">
          <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor="brand.100">
            <Text fontSize="sm" fontWeight="600" color="brand.700">
              Company Information
            </Text>
            <Button
              size="xs"
              variant="ghost"
              leftIcon={<PencilSimple size={14} />}
              onClick={onCompanyOpen}
            >
              Edit
            </Button>
          </Flex>
          <Box p={4}>
            <VStack align="stretch" gap={4}>
              <InfoItem icon={Buildings} label="Company Name" value={settings.name} />
              <InfoItem icon={Envelope} label="Email" value={settings.email} />
              <InfoItem icon={Phone} label="Phone" value={settings.phone} />
              <InfoItem icon={MapPin} label="Address" value={settings.address} />
              <InfoItem icon={IdentificationCard} label="Business ID / Tax Number" value={settings.businessId} />
            </VStack>
          </Box>
        </Box>

        {/* Payment Methods */}
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100" overflow="hidden">
          <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor="brand.100">
            <Box>
              <Text fontSize="sm" fontWeight="600" color="brand.700">
                Payment Methods
              </Text>
              <Text fontSize="xs" color="brand.400">
                Add payment methods to include on your invoices
              </Text>
            </Box>
            <Button
              size="xs"
              leftIcon={<Plus size={14} weight="bold" />}
              onClick={handleAddPayment}
            >
              Add Method
            </Button>
          </Flex>
          <Box p={4}>
            {settings.paymentMethods.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={8}
                px={4}
                bg="brand.50"
                borderRadius="lg"
                border="1px dashed"
                borderColor="brand.200"
              >
                <Text fontSize="sm" color="brand.500" textAlign="center">
                  No payment methods configured yet.
                </Text>
                <Text fontSize="xs" color="brand.400" textAlign="center" mt={1}>
                  Add a payment method to show payment details on your invoices.
                </Text>
                <Button
                  size="sm"
                  mt={4}
                  leftIcon={<Plus size={14} weight="bold" />}
                  onClick={handleAddPayment}
                >
                  Add Payment Method
                </Button>
              </Flex>
            ) : (
              <VStack gap={3} align="stretch">
                {settings.paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={() => handleEditPayment(method)}
                    onDelete={() => handleDeletePayment(method.id)}
                    onSetDefault={() => setDefaultPaymentMethod(method.id)}
                  />
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </VStack>

      {/* Drawers */}
      <CompanyInfoDrawer
        isOpen={isCompanyOpen}
        onClose={onCompanyClose}
        settings={settings}
        onSave={handleCompanySave}
      />

      <PaymentMethodDrawer
        isOpen={isPaymentOpen}
        onClose={() => {
          onPaymentClose();
          setEditingMethod(null);
        }}
        method={editingMethod}
        onSave={handlePaymentSave}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method? This cannot be undone."
      />
    </Container>
  );
};
