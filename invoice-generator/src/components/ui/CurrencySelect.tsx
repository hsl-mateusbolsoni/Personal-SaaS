import { Select } from '@chakra-ui/react';
import { CURRENCY_OPTIONS } from '../../config/currencies';
import type { CurrencyCode } from '../../types/currency';

export const CurrencySelect = ({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
}) => (
  <Select size="sm" value={value} onChange={(e) => onChange(e.target.value as CurrencyCode)}>
    {CURRENCY_OPTIONS.map((c) => (
      <option key={c.code} value={c.code}>
        {c.code} - {c.name}
      </option>
    ))}
  </Select>
);
