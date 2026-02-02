import { SimpleGrid, FormControl, FormLabel, Input, Textarea, Box } from '@chakra-ui/react';
import { ClientSelector } from '../../client/ClientSelector';
import type { ClientInfo } from '../../../types/invoice';
import type { Client } from '../../../types/client';

interface Props {
  to: ClientInfo & { clientId?: string };
  onChange: (to: ClientInfo & { clientId?: string }) => void;
}

export const ClientSection = ({ to, onChange }: Props) => {
  const update = (field: string, value: string) => {
    onChange({ ...to, [field]: value });
  };

  const handleSelectClient = (client: Client | null) => {
    if (client) {
      onChange({
        clientId: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
      });
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <ClientSelector value={to.clientId} onChange={handleSelectClient} />
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        <FormControl>
          <FormLabel fontSize="xs">Client Name</FormLabel>
          <Input size="sm" value={to.name} onChange={(e) => update('name', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">Email</FormLabel>
          <Input size="sm" value={to.email} onChange={(e) => update('email', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">Phone</FormLabel>
          <Input size="sm" value={to.phone} onChange={(e) => update('phone', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">Address</FormLabel>
          <Textarea size="sm" rows={2} value={to.address} onChange={(e) => update('address', e.target.value)} />
        </FormControl>
      </SimpleGrid>
    </Box>
  );
};
