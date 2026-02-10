import { Box, VStack, Text, Input, FormControl, FormLabel, Textarea, Button, SimpleGrid, Flex, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { FloppyDisk } from 'phosphor-react';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { CurrencySelect } from '../components/ui/CurrencySelect';
import { useSettingsStore } from '../stores/useSettingsStore';
import { toast } from '../utils/toast';
import { PAYMENT_TYPE_LABELS } from '../config/payments';
import type { CurrencyCode } from '../types/currency';
import type { BankDetails, PaymentType } from '../types/settings';

export const Settings = () => {
  const { settings, updateSettings, markSetupComplete } = useSettingsStore();

  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [businessId, setBusinessId] = useState(settings.businessId);
  const [paymentType, setPaymentType] = useState<PaymentType>(settings.paymentType || 'bank_transfer');
  const [bankDetails, setBankDetails] = useState<BankDetails>(settings.bankDetails || {
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    swiftBic: '',
    iban: '',
  });
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate);
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>(settings.defaultCurrency);
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState(settings.invoiceNumberPrefix);

  const updateBankField = (field: keyof BankDetails, value: string) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings({
      name, email, phone, address, businessId, paymentType, bankDetails,
      defaultTaxRate, defaultCurrency, invoiceNumberPrefix,
    });
    markSetupComplete();
    toast.success({ title: 'Settings saved' });
  };

  return (
    <Container>
      <PageHeader
        title="Settings"
        subtitle="Configure your company details and defaults"
      />

      <VStack gap={6} align="stretch">
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Text fontSize="sm" fontWeight="600" color="brand.700" mb={4}>
            Company Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Company Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Company" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Business ID / Tax Number</FormLabel>
              <Input value={businessId} onChange={(e) => setBusinessId(e.target.value)} placeholder="e.g. EIN, VAT, ABN" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@company.com" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Phone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
            </FormControl>
            <FormControl gridColumn={{ md: 'span 2' }}>
              <FormLabel fontSize="sm" fontWeight="500">Address</FormLabel>
              <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, Country" />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Text fontSize="sm" fontWeight="600" color="brand.700" mb={4}>
            Payment Details
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormControl gridColumn={{ md: 'span 2' }}>
              <FormLabel fontSize="sm" fontWeight="500">Payment Type</FormLabel>
              <Select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
              >
                {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Bank Name</FormLabel>
              <Input
                value={bankDetails.bankName}
                onChange={(e) => updateBankField('bankName', e.target.value)}
                placeholder="e.g. Chase Bank"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Account Holder Name</FormLabel>
              <Input
                value={bankDetails.accountName}
                onChange={(e) => updateBankField('accountName', e.target.value)}
                placeholder="Your Company LLC"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Account Number</FormLabel>
              <Input
                value={bankDetails.accountNumber}
                onChange={(e) => updateBankField('accountNumber', e.target.value)}
                placeholder="1234567890"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Routing / Sort Code</FormLabel>
              <Input
                value={bankDetails.routingNumber}
                onChange={(e) => updateBankField('routingNumber', e.target.value)}
                placeholder="e.g. 021000021"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">SWIFT / BIC</FormLabel>
              <Input
                value={bankDetails.swiftBic}
                onChange={(e) => updateBankField('swiftBic', e.target.value)}
                placeholder="e.g. CHASUS33"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">IBAN</FormLabel>
              <Input
                value={bankDetails.iban}
                onChange={(e) => updateBankField('iban', e.target.value)}
                placeholder="e.g. GB82 WEST 1234 5698 7654 32"
              />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Text fontSize="sm" fontWeight="600" color="brand.700" mb={4}>
            Invoice Defaults
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Default Currency</FormLabel>
              <CurrencySelect value={defaultCurrency} onChange={setDefaultCurrency} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Default Tax Rate (%)</FormLabel>
              <Input
                type="number"
                value={defaultTaxRate || ''}
                onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Invoice Number Prefix</FormLabel>
              <Input value={invoiceNumberPrefix} onChange={(e) => setInvoiceNumberPrefix(e.target.value)} placeholder="INV-" />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Flex justify="flex-end">
          <Button onClick={handleSave} leftIcon={<FloppyDisk size={16} weight="bold" />}>
            Save Settings
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
