import { VStack, Input, Textarea, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useState } from 'react';
import type { Client } from '../../types/client';

interface ClientFormProps {
  initial?: Partial<Client>;
  onSubmit: (data: { name: string; email: string; phone: string; address: string }) => void;
  onCancel?: () => void;
}

export const ClientForm = ({ initial, onSubmit, onCancel }: ClientFormProps) => {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() });
  };

  return (
    <VStack gap={3} align="stretch">
      <FormControl isInvalid={!!errors.name}>
        <FormLabel fontSize="xs">Name</FormLabel>
        <Input size="sm" value={name} onChange={(e) => setName(e.target.value)} />
        <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel fontSize="xs">Email</FormLabel>
        <Input size="sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs">Phone</FormLabel>
        <Input size="sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs">Address</FormLabel>
        <Textarea size="sm" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
      </FormControl>
      <Flex gap={2} justify="flex-end">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={handleSubmit}>
          {initial?.id ? 'Update' : 'Add'} Client
        </Button>
      </Flex>
    </VStack>
  );
};

import { Flex } from '@chakra-ui/react';
