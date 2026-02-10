import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { UserPlus, FloppyDisk } from 'phosphor-react';
import type { Client } from '../../types/client';

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSubmit: (data: { name: string; email: string; phone: string; address: string }) => void;
}

export const ClientDrawer = ({ isOpen, onClose, client, onSubmit }: ClientDrawerProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!client?.id;

  useEffect(() => {
    if (isOpen) {
      setName(client?.name || '');
      setEmail(client?.email || '');
      setPhone(client?.phone || '');
      setAddress(client?.address || '');
      setErrors({});
    }
  }, [isOpen, client]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center" gap={2}>
          <UserPlus size={20} weight="duotone" color="#6366f1" />
          {isEditing ? 'Edit Client' : 'New Client'}
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack gap={4} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="sm" fontWeight="500">Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="sm" fontWeight="500">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@email.com"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, Country"
                rows={3}
              />
            </FormControl>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" gap={2}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            leftIcon={<FloppyDisk size={16} weight="bold" />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEditing ? 'Update' : 'Add'} Client
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
