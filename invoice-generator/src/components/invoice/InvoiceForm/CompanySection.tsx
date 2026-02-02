import { SimpleGrid, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import type { CompanyInfo } from '../../../types/invoice';

interface Props {
  from: CompanyInfo;
  onChange: (from: CompanyInfo) => void;
}

export const CompanySection = ({ from, onChange }: Props) => {
  const update = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...from, [field]: value });
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
      <FormControl>
        <FormLabel fontSize="xs">Company Name</FormLabel>
        <Input size="sm" value={from.name} onChange={(e) => update('name', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs">Email</FormLabel>
        <Input size="sm" value={from.email} onChange={(e) => update('email', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs">Phone</FormLabel>
        <Input size="sm" value={from.phone} onChange={(e) => update('phone', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs">Address</FormLabel>
        <Textarea size="sm" rows={2} value={from.address} onChange={(e) => update('address', e.target.value)} />
      </FormControl>
    </SimpleGrid>
  );
};
