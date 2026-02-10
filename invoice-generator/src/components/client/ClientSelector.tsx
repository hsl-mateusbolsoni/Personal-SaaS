import { Select } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useClientStore } from '../../stores/useClientStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { Client } from '../../types/client';

export const ClientSelector = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (client: Client | null) => void;
}) => {
  const clients = useClientStore((s) => s.clients);
  const lastUsedClientId = useSettingsStore((s) => s.settings.lastUsedClientId);
  const setLastUsedClient = useSettingsStore((s) => s.setLastUsedClient);
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (!hasAutoSelected.current && !value && lastUsedClientId && clients.length > 0) {
      const lastClient = clients.find((c) => c.id === lastUsedClientId);
      if (lastClient) {
        hasAutoSelected.current = true;
        onChange(lastClient);
      }
    }
  }, [clients, lastUsedClientId, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const client = clients.find((c) => c.id === e.target.value);
    if (client) {
      setLastUsedClient(client.id);
    }
    onChange(client || null);
  };

  return (
    <Select
      size="sm"
      placeholder="Select a saved client..."
      value={value || ''}
      onChange={handleChange}
    >
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </Select>
  );
};
