import { useState, useRef, useEffect } from 'react';
import { Input, Box, Text } from '@chakra-ui/react';
import { formatCurrency } from '../../../utils/currency';
import type { CurrencyCode } from '../../../types/currency';

interface InlineCurrencyProps {
  value: number; // in cents
  onChange: (value: number) => void;
  currency: CurrencyCode;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'right';
  color?: string;
  readOnly?: boolean;
}

export const InlineCurrency = ({
  value,
  onChange,
  currency,
  fontSize = '10pt',
  fontWeight = 'normal',
  textAlign = 'right',
  color = '#000',
  readOnly = false,
}: InlineCurrencyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState((value / 100).toFixed(2));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setLocalValue((value / 100).toFixed(2));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(localValue) || 0;
    const cents = Math.round(numValue * 100);
    if (cents !== value) {
      onChange(cents);
    }
    setLocalValue((cents / 100).toFixed(2));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setLocalValue((value / 100).toFixed(2));
      setIsEditing(false);
    }
  };

  if (readOnly) {
    return (
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAlign={textAlign}
        color={color}
        lineHeight="1.4"
      >
        {formatCurrency(value, currency)}
      </Text>
    );
  }

  return (
    <Box
      position="relative"
      cursor="text"
      onClick={() => setIsEditing(true)}
      borderRadius="sm"
      transition="all 0.15s"
      _hover={{
        outline: isEditing ? 'none' : '1px dashed',
        outlineColor: 'accent.300',
        outlineOffset: '2px',
      }}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="number"
          step="0.01"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          variant="unstyled"
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAlign={textAlign}
          color={color}
          bg="accent.50"
          px={1}
          py={0}
          height="auto"
          minH="unset"
          lineHeight="1.4"
          borderRadius="sm"
        />
      ) : (
        <Text
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAlign={textAlign}
          color={color}
          lineHeight="1.4"
          px={0}
        >
          {formatCurrency(value, currency)}
        </Text>
      )}
    </Box>
  );
};
