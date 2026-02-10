import { Editable, EditablePreview, EditableTextarea } from '@chakra-ui/react';

interface InlineTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  rows?: number;
}

export const InlineTextArea = ({
  value,
  onChange,
  placeholder = '',
  fontSize = '10pt',
  fontWeight = 'normal',
  color = '#000',
  rows = 2,
}: InlineTextAreaProps) => {
  return (
    <Editable
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      selectAllOnFocus={false}
    >
      <EditablePreview
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={value ? color : 'brand.300'}
        lineHeight="1.4"
        py={0}
        px={0}
        minH="unset"
        whiteSpace="pre-wrap"
        cursor="text"
        borderRadius="sm"
        transition="all 0.15s"
        _hover={{
          outline: '1px dashed',
          outlineColor: 'accent.300',
          outlineOffset: '2px',
        }}
      />
      <EditableTextarea
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        lineHeight="1.4"
        py={0}
        px={1}
        minH="unset"
        rows={rows}
        resize="none"
        bg="accent.50"
        borderRadius="sm"
        _placeholder={{ color: 'brand.300' }}
      />
    </Editable>
  );
};
