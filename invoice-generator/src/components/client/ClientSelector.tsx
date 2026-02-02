import { Select } from '@chakra-ui/react';
import { useClientStore } from '../../stores/useClientStore';
import type { Client } from '../../types/client';

export const ClientSelector = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (client: Client | null) => void;
}) => {
  const clients = useClientStore((s) => s.clients);

  return (
    <Select
      size="sm"
      placeholder="Select a saved client..."
      value={value || ''}
      onChange={(e) => {
        const client = clients.find((c) => c.id === e.target.value);
        onChange(client || null);
      }}
    >
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </Select>
  );
};
