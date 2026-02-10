import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Lightning, ArrowRight } from 'phosphor-react';
import { ClientSelector } from '../client/ClientSelector';
import { CurrencyInput } from '../ui/CurrencyInput';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useInvoiceActions } from '../../hooks/useInvoiceActions';
import { todayISO, futureDateISO } from '../../utils/formatting';
import type { Client } from '../../types/client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickInvoiceModal = ({ isOpen, onClose }: Props) => {
  const { create } = useInvoiceActions();
  const settings = useSettingsStore((s) => s.settings);
  const setLastUsedClient = useSettingsStore((s) => s.setLastUsedClient);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [amountCents, setAmountCents] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClientChange = (client: Client | null) => {
    setSelectedClient(client);
    if (client) {
      setLastUsedClient(client.id);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient || amountCents <= 0) return;

    setIsSubmitting(true);
    try {
      await create({
        invoiceNumber: `${settings.invoiceNumberPrefix}${settings.nextInvoiceNumber.toString().padStart(3, '0')}`,
        date: todayISO(),
        dueDate: futureDateISO(30),
        currency: settings.defaultCurrency,
        from: {
          name: settings.name,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
        },
        to: {
          clientId: selectedClient.id,
          name: selectedClient.name,
          email: selectedClient.email,
          phone: selectedClient.phone,
          address: selectedClient.address,
        },
        items: [
          {
            id: crypto.randomUUID(),
            description: 'Services',
            quantity: 1,
            rateCents: amountCents,
            amountCents: amountCents,
          },
        ],
        taxRate: settings.defaultTaxRate,
        discount: null,
        subtotalCents: amountCents,
        discountAmountCents: 0,
        taxAmountCents: Math.round(amountCents * (settings.defaultTaxRate / 100)),
        totalCents: amountCents + Math.round(amountCents * (settings.defaultTaxRate / 100)),
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedClient(null);
    setAmountCents(0);
    onClose();
  };

  const isValid = selectedClient !== null && amountCents > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>
          <Lightning size={20} weight="duotone" color="#6366f1" style={{ display: 'inline', marginRight: 8 }} />
          Quick Invoice
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack gap={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Select Client</FormLabel>
              <ClientSelector
                value={selectedClient?.id}
                onChange={handleClientChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Invoice Amount</FormLabel>
              <CurrencyInput
                value={amountCents}
                currency={settings.defaultCurrency}
                onChange={setAmountCents}
              />
              {settings.defaultTaxRate > 0 && amountCents > 0 && (
                <Text fontSize="xs" color="brand.400" mt={1}>
                  + {settings.defaultTaxRate}% tax will be applied
                </Text>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!isValid}
            rightIcon={<ArrowRight size={16} weight="bold" />}
          >
            Create Invoice
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
