import { Editable, EditableInput, EditablePreview, Input } from '@chakra-ui/react';

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
}: InlineTextProps) => {
  // For date inputs, use a regular input since Editable doesn't support type="date"
  if (type === 'date') {
    return (
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        borderRadius="sm"
        cursor="pointer"
        _hover={{
          outline: '1px dashed',
          outlineColor: 'accent.300',
          outlineOffset: '2px',
        }}
        _focus={{
          bg: 'accent.50',
          outline: 'none',
          px: 1,
        }}
      />
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
