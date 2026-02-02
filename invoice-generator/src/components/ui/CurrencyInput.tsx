import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { CURRENCY_CONFIGS } from '../../config/currencies';
import type { CurrencyCode } from '../../types/currency';

export const CurrencyInput = ({
  currency,
  value,
  onChange,
}: {
  currency: CurrencyCode;
  value: number;
  onChange: (cents: number) => void;
}) => {
  const config = CURRENCY_CONFIGS[currency];
  const displayValue = value / Math.pow(10, config.decimals);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value) || 0;
    const cents = Math.round(inputValue * Math.pow(10, config.decimals));
    onChange(cents);
  };

  return (
    <InputGroup size="sm">
      <InputLeftAddon>{config.symbol}</InputLeftAddon>
      <Input
        type="number"
        step={1 / Math.pow(10, config.decimals)}
        value={displayValue || ''}
        onChange={handleChange}
      />
    </InputGroup>
  );
};
