import { useState } from 'react';
import { Editable, EditableInput, EditablePreview, Input, Text, Box } from '@chakra-ui/react';

interface InlineTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'right' | 'center';
  color?: string;
  width?: string;
  type?: 'text' | 'date';
  displayValue?: string;
}

export const InlineText = ({
  value,
  onChange,
  placeholder = '',
  fontSize = '10pt',
  fontWeight = 'normal',
  textAlign = 'left',
  color = '#000',
  width,
  type = 'text',
  displayValue,
}: InlineTextProps) => {
  const [isEditingDate, setIsEditingDate] = useState(false);

  // For date inputs, show displayValue when not editing, date picker when editing
  if (type === 'date') {
    if (isEditingDate) {
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditingDate(false)}
          autoFocus
          variant="unstyled"
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAlign={textAlign}
          color={color}
          width={width || 'auto'}
          height="auto"
          minH="unset"
          lineHeight="1.4"
          p={0}
          px={1}
          borderRadius="sm"
          bg="accent.50"
        />
      );
    }

    return (
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAlign={textAlign}
        color={value ? color : 'brand.300'}
        lineHeight="1.4"
        cursor="pointer"
        borderRadius="sm"
        onClick={() => setIsEditingDate(true)}
        _hover={{
          outline: '1px dashed',
          outlineColor: 'accent.300',
          outlineOffset: '2px',
        }}
      >
        {displayValue || value || placeholder}
      </Text>
    );
  }

  return (
    <Editable
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      selectAllOnFocus={false}
      width={width}
    >
      <EditablePreview
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAlign={textAlign}
        color={value ? color : 'brand.300'}
        lineHeight="1.4"
        py={0}
        px={0}
        minH="unset"
        cursor="text"
        borderRadius="sm"
        transition="all 0.15s"
        _hover={{
          outline: '1px dashed',
          outlineColor: 'accent.300',
          outlineOffset: '2px',
        }}
      />
      <EditableInput
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAlign={textAlign}
        color={color}
        lineHeight="1.4"
        py={0}
        px={1}
        minH="unset"
        bg="accent.50"
        borderRadius="sm"
        _placeholder={{ color: 'brand.300' }}
      />
    </Editable>
  );
};
