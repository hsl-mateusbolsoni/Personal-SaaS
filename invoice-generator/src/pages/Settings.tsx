import { Box, VStack, Text, Input, FormControl, FormLabel, Textarea, Button, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { CurrencySelect } from '../components/ui/CurrencySelect';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useToast } from '@chakra-ui/react';
import type { CurrencyCode } from '../types/currency';

export const Settings = () => {
  const { settings, updateSettings, markSetupComplete } = useSettingsStore();
  const toast = useToast();

  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate);
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>(settings.defaultCurrency);
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState(settings.invoiceNumberPrefix);

  const handleSave = () => {
    updateSettings({
      name, email, phone, address,
      defaultTaxRate, defaultCurrency, invoiceNumberPrefix,
    });
    markSetupComplete();
    toast({ title: 'Settings saved', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
  };

  return (
    <Container>
      <Text fontSize="md" fontWeight="700" mb={6}>Settings</Text>
      <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="gray.200">
        <VStack gap={4} align="stretch">
          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
            Company Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            <FormControl>
              <FormLabel fontSize="xs">Company Name</FormLabel>
              <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Email</FormLabel>
              <Input size="sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Phone</FormLabel>
              <Input size="sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Address</FormLabel>
              <Textarea size="sm" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            </FormControl>
          </SimpleGrid>

          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider" mt={4}>
            Defaults
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <FormControl>
              <FormLabel fontSize="xs">Default Currency</FormLabel>
              <CurrencySelect value={defaultCurrency} onChange={setDefaultCurrency} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Default Tax Rate (%)</FormLabel>
              <Input
                size="sm"
                type="number"
                value={defaultTaxRate || ''}
                onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Invoice Number Prefix</FormLabel>
              <Input size="sm" value={invoiceNumberPrefix} onChange={(e) => setInvoiceNumberPrefix(e.target.value)} />
            </FormControl>
          </SimpleGrid>

          <Flex justify="flex-end" mt={4}>
            <Button size="sm" onClick={handleSave}>Save Settings</Button>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

import { Flex } from '@chakra-ui/react';
