import { Box, Flex, Text } from '@chakra-ui/react';

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string; count?: number }>;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = 'sm',
}: SegmentedControlProps<T>) {
  const padding = size === 'sm' ? '4px' : '5px';
  const fontSize = size === 'sm' ? 'xs' : 'sm';
  const itemPy = size === 'sm' ? '5px' : '6px';
  const itemPx = size === 'sm' ? '12px' : '16px';

  return (
    <Flex
      bg="brand.100"
      borderRadius="lg"
      p={padding}
      gap="2px"
      display="inline-flex"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <Box
            key={option.value}
            as="button"
            type="button"
            py={itemPy}
            px={itemPx}
            borderRadius="md"
            fontSize={fontSize}
            fontWeight="500"
            color={isActive ? 'brand.800' : 'brand.500'}
            bg={isActive ? 'white' : 'transparent'}
            shadow={isActive ? 'sm' : 'none'}
            transition="all 0.15s"
            onClick={() => onChange(option.value)}
            _hover={{
              color: isActive ? 'brand.800' : 'brand.700',
            }}
          >
            <Flex align="center" gap={1.5}>
              <Text textTransform="capitalize">{option.label}</Text>
              {option.count !== undefined && option.count > 0 && (
                <Box
                  as="span"
                  bg={isActive ? 'brand.100' : 'brand.200'}
                  color={isActive ? 'brand.700' : 'brand.500'}
                  px={1.5}
                  py={0.5}
                  borderRadius="full"
                  fontSize="10px"
                  fontWeight="600"
                  lineHeight="1"
                >
                  {option.count}
                </Box>
              )}
            </Flex>
          </Box>
        );
      })}
    </Flex>
  );
}
