import { Box, VStack, Text, Select, FormControl, FormLabel, Switch, Flex, Button, Divider, Input, SimpleGrid, Avatar, useDisclosure, HStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FloppyDisk, User, Export, Trash, SignOut, PencilSimple, Check, X } from 'phosphor-react';
import { Container } from '../components/layout/Container';
import { PageHeader } from '../components/layout/PageHeader';
import { CurrencySelect } from '../components/ui/CurrencySelect';
import { AuthModal } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';
import { useSettingsStore } from '../stores/useSettingsStore';
import { toast } from '../utils/toast';
import type { DateFormat } from '../types/settings';
import type { CurrencyCode } from '../types/currency';

export const Settings = () => {
  const { user, isLoading: authLoading, isConfigured, signOut, updateProfile } = useAuth();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { appSettings, updateAppSettings } = useSettingsStore();

  const [dateFormat, setDateFormat] = useState<DateFormat>(appSettings.dateFormat);
  const [weekStartsOn, setWeekStartsOn] = useState<'sunday' | 'monday'>(appSettings.weekStartsOn);
  const [autoSave, setAutoSave] = useState(appSettings.autoSave);
  const [showDueDateWarnings, setShowDueDateWarnings] = useState(appSettings.showDueDateWarnings);
  const [defaultTaxRate, setDefaultTaxRate] = useState(appSettings.defaultTaxRate);
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>(appSettings.defaultCurrency);
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState(appSettings.invoiceNumberPrefix);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleEditName = () => {
    setEditName(user?.user_metadata?.full_name || '');
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditName('');
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setIsSavingProfile(true);
    const { error } = await updateProfile({ full_name: editName.trim() });
    setIsSavingProfile(false);
    if (error) {
      toast.error({ title: 'Failed to update profile', description: error.message });
    } else {
      toast.success({ title: 'Profile updated' });
      setIsEditingName(false);
    }
  };

  useEffect(() => {
    setDateFormat(appSettings.dateFormat);
    setWeekStartsOn(appSettings.weekStartsOn);
    setAutoSave(appSettings.autoSave);
    setShowDueDateWarnings(appSettings.showDueDateWarnings);
    setDefaultTaxRate(appSettings.defaultTaxRate);
    setDefaultCurrency(appSettings.defaultCurrency);
    setInvoiceNumberPrefix(appSettings.invoiceNumberPrefix);
  }, [appSettings]);

  const handleSave = () => {
    updateAppSettings({
      dateFormat,
      weekStartsOn,
      autoSave,
      showDueDateWarnings,
      defaultTaxRate,
      defaultCurrency,
      invoiceNumberPrefix,
    });
    toast.success({ title: 'Settings saved' });
  };

  const handleExportData = () => {
    const data = {
      invoices: JSON.parse(localStorage.getItem('invoice-generator-v1:invoices') || '{}'),
      clients: JSON.parse(localStorage.getItem('invoice-generator-v1:clients') || '{}'),
      settings: JSON.parse(localStorage.getItem('invoice-generator-v1:settings') || '{}'),
      activities: JSON.parse(localStorage.getItem('invoice-generator-v1:activities') || '{}'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoicer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success({ title: 'Data exported successfully' });
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('invoice-generator-v1:invoices');
      localStorage.removeItem('invoice-generator-v1:clients');
      localStorage.removeItem('invoice-generator-v1:activities');
      toast.info({ title: 'Data cleared', description: 'Refresh the page to see changes' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.info({ title: 'Signed out successfully' });
  };

  return (
    <Container>
      <PageHeader
        title="Settings"
        subtitle="Application preferences and invoice defaults"
      />

      <VStack gap={6} align="stretch">
        {/* Account Section */}
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Flex align="center" gap={3} mb={4}>
            <Box p={2} borderRadius="full" bg="brand.100">
              <User size={20} weight="bold" color="#525252" />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="600" color="brand.700">
                Account
              </Text>
              <Text fontSize="xs" color="brand.400">
                {user ? 'Manage your account' : 'Sign in to sync your data'}
              </Text>
            </Box>
          </Flex>

          {!isConfigured ? (
            <Box p={4} bg="warning.50" borderRadius="lg" border="1px dashed" borderColor="warning.500">
              <Text fontSize="sm" color="warning.600" textAlign="center">
                Authentication is not configured. Add Supabase credentials to enable sign in.
              </Text>
            </Box>
          ) : authLoading ? (
            <Box p={4} bg="brand.50" borderRadius="lg">
              <Text fontSize="sm" color="brand.500" textAlign="center">
                Loading...
              </Text>
            </Box>
          ) : user ? (
            <VStack align="stretch" gap={4}>
              <Flex
                align="center"
                justify="space-between"
                p={4}
                bg="accent.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="accent.200"
              >
                <Flex align="center" gap={3}>
                  <Avatar
                    size="md"
                    name={user.user_metadata?.full_name || user.email}
                    src={user.user_metadata?.avatar_url}
                  />
                  <Box>
                    {isEditingName ? (
                      <HStack>
                        <Input
                          size="sm"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your name"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <Button
                          size="sm"
                          colorScheme="green"
                          variant="ghost"
                          onClick={handleSaveName}
                          isLoading={isSavingProfile}
                          p={1}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          p={1}
                        >
                          <X size={16} />
                        </Button>
                      </HStack>
                    ) : (
                      <Flex align="center" gap={2}>
                        <Text fontSize="sm" fontWeight="600" color="brand.800">
                          {user.user_metadata?.full_name || 'Add your name'}
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={handleEditName}
                          p={1}
                          minW="auto"
                        >
                          <PencilSimple size={14} />
                        </Button>
                      </Flex>
                    )}
                    <Text fontSize="xs" color="brand.500">
                      {user.email}
                    </Text>
                  </Box>
                </Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<SignOut size={14} />}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </Flex>
            </VStack>
          ) : (
            <Box p={4} bg="brand.50" borderRadius="lg" border="1px dashed" borderColor="brand.200">
              <Text fontSize="sm" color="brand.500" textAlign="center">
                Sign in to sync your data across devices and access premium features.
              </Text>
              <Flex justify="center" mt={3}>
                <Button size="sm" onClick={onAuthOpen}>
                  Sign In
                </Button>
              </Flex>
            </Box>
          )}
        </Box>

        {/* Invoice Defaults */}
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
              <Input
                value={invoiceNumberPrefix}
                onChange={(e) => setInvoiceNumberPrefix(e.target.value)}
                placeholder="INV-"
              />
            </FormControl>
          </SimpleGrid>
        </Box>

        {/* Preferences */}
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Text fontSize="sm" fontWeight="600" color="brand.700" mb={4}>
            Preferences
          </Text>
          <VStack gap={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="500">Date Format</FormLabel>
                <Select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value as DateFormat)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="500">Week Starts On</FormLabel>
                <Select
                  value={weekStartsOn}
                  onChange={(e) => setWeekStartsOn(e.target.value as 'sunday' | 'monday')}
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <Divider />

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <FormLabel fontSize="sm" fontWeight="500" mb={0}>Auto-save</FormLabel>
                <Text fontSize="xs" color="brand.400">
                  Automatically save changes while editing
                </Text>
              </Box>
              <Switch
                isChecked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                colorScheme="purple"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <FormLabel fontSize="sm" fontWeight="500" mb={0}>Due Date Warnings</FormLabel>
                <Text fontSize="xs" color="brand.400">
                  Show warnings for overdue invoices
                </Text>
              </Box>
              <Switch
                isChecked={showDueDateWarnings}
                onChange={(e) => setShowDueDateWarnings(e.target.checked)}
                colorScheme="purple"
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Data Management */}
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="brand.100">
          <Text fontSize="sm" fontWeight="600" color="brand.700" mb={4}>
            Data Management
          </Text>
          <VStack gap={3} align="stretch">
            <Flex justify="space-between" align="center" p={3} bg="brand.50" borderRadius="lg">
              <Box>
                <Text fontSize="sm" fontWeight="500" color="brand.700">Export Data</Text>
                <Text fontSize="xs" color="brand.400">
                  Download all your invoices, clients, and settings
                </Text>
              </Box>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Export size={14} />}
                onClick={handleExportData}
              >
                Export
              </Button>
            </Flex>

            <Flex justify="space-between" align="center" p={3} bg="danger.50" borderRadius="lg">
              <Box>
                <Text fontSize="sm" fontWeight="500" color="danger.600">Clear All Data</Text>
                <Text fontSize="xs" color="brand.400">
                  Permanently delete all invoices, clients, and activities
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<Trash size={14} />}
                onClick={handleClearData}
              >
                Clear
              </Button>
            </Flex>
          </VStack>
        </Box>

        <Flex justify="flex-end">
          <Button onClick={handleSave} leftIcon={<FloppyDisk size={16} weight="bold" />}>
            Save Settings
          </Button>
        </Flex>
      </VStack>

      <AuthModal isOpen={isAuthOpen} onClose={onAuthClose} />
    </Container>
  );
};
