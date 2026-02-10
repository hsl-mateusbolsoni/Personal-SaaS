import { Box, Flex, Text, useToken } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface TimelineItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  timestamp: string;
  isLast?: boolean;
  iconBg?: string;
  iconColor?: string;
}

export const TimelineItem = ({
  icon,
  title,
  description,
  timestamp,
  isLast = false,
  iconBg = 'brand.100',
  iconColor = 'brand.600',
}: TimelineItemProps) => {
  const [lineColor] = useToken('colors', ['brand.200']);

  return (
    <Flex gap={3}>
      {/* Timeline track */}
      <Flex direction="column" align="center" minW="32px">
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          borderRadius="full"
          bg={iconBg}
          color={iconColor}
          flexShrink={0}
        >
          {icon}
        </Flex>
        {!isLast && (
          <Box
            w="2px"
            flex={1}
            minH="24px"
            bg={lineColor}
            mt={2}
          />
        )}
      </Flex>

      {/* Content */}
      <Box pb={isLast ? 0 : 6} pt={1}>
        <Text fontSize="sm" fontWeight="600" color="brand.800">
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="brand.500" mt={0.5}>
            {description}
          </Text>
        )}
        <Text fontSize="xs" color="brand.400" mt={1}>
          {timestamp}
        </Text>
      </Box>
    </Flex>
  );
};

interface TimelineProps {
  children: ReactNode;
}

export const Timeline = ({ children }: TimelineProps) => (
  <Box>{children}</Box>
);
