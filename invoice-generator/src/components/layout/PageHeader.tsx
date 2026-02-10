import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  actions?: ReactNode;
  titleExtra?: ReactNode;
}

export const PageHeader = ({ title, subtitle, backPath, actions, titleExtra }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Flex justify="space-between" align="flex-start" mb={6} flexWrap="wrap" gap={4}>
      <Flex align="flex-start" gap={3}>
        {backPath && (
          <Button
            variant="ghost"
            size="sm"
            p={2}
            minW="auto"
            onClick={() => navigate(backPath)}
            mt={0.5}
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <Box>
          <HStack gap={2} align="center">
            <Text fontSize="2xl" fontWeight="800" color="brand.800" letterSpacing="-0.02em">
              {title}
            </Text>
            {titleExtra}
          </HStack>
          {subtitle && (
            <Text fontSize="sm" color="brand.500" mt={0.5}>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
      {actions && (
        <Flex gap={2} flexWrap="wrap">
          {actions}
        </Flex>
      )}
    </Flex>
  );
};
