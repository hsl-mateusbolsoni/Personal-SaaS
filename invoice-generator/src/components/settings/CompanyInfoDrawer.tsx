import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FloppyDisk } from 'phosphor-react';
import type { CompanySettings } from '../../types/settings';

interface CompanyInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  onSave: (updates: Partial<CompanySettings>) => void;
}

export const CompanyInfoDrawer = ({
  isOpen,
  onClose,
  settings,
  onSave,
}: CompanyInfoDrawerProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessId, setBusinessId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(settings.name);
      setEmail(settings.email);
      setPhone(settings.phone);
      setAddress(settings.address);
      setBusinessId(settings.businessId);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave({ name, email, phone, address, businessId });
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="brand.100">
          Edit Company Information
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack gap={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Company Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Company LLC"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@company.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Phone</FormLabel>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Address</FormLabel>
              <Textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St&#10;City, State 12345&#10;Country"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">Business ID / Tax Number</FormLabel>
              <Input
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="e.g. EIN, VAT, ABN"
              />
            </FormControl>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor="brand.100">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button leftIcon={<FloppyDisk size={16} />} onClick={handleSave}>
            Save Changes
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
