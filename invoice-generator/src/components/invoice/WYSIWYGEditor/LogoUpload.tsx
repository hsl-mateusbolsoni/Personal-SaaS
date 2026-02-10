import { useState, useRef } from 'react';
import { Box, Image, Text, Flex, IconButton, Input, useToken } from '@chakra-ui/react';
import { Trash, Upload } from 'phosphor-react';

interface LogoUploadProps {
  logo: string | null;
  onChange: (logo: string | null) => void;
  show: boolean;
}

export const LogoUpload = ({ logo, onChange, show }: LogoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [iconColor] = useToken('colors', ['brand.400']);

  if (!show) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (logo) {
    return (
      <Box position="relative" display="inline-block" mb={3}>
        <Image
          src={logo}
          alt="Company logo"
          maxH="50px"
          maxW="150px"
          objectFit="contain"
        />
        <IconButton
          aria-label="Remove logo"
          icon={<Trash size={12} />}
          size="xs"
          position="absolute"
          top={-1}
          right={-1}
          borderRadius="full"
          colorScheme="red"
          onClick={() => onChange(null)}
        />
      </Box>
    );
  }

  return (
    <Box mb={3}>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        display="none"
      />
      <Flex
        align="center"
        justify="center"
        gap={2}
        py={3}
        px={4}
        border="1px dashed"
        borderColor={isDragging ? 'accent.400' : 'brand.200'}
        borderRadius="md"
        bg={isDragging ? 'accent.50' : 'brand.50'}
        cursor="pointer"
        transition="all 0.15s"
        _hover={{ borderColor: 'accent.300', bg: 'brand.100' }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        maxW="180px"
      >
        <Upload size={16} color={iconColor} />
        <Text fontSize="8pt" color="brand.500">
          Upload logo
        </Text>
      </Flex>
    </Box>
  );
};
