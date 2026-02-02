import { Flex, Text, HStack, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const NAV_ITEMS = [
  { label: 'Invoices', path: ROUTES.DASHBOARD },
  { label: 'Clients', path: ROUTES.CLIENTS },
  { label: 'Settings', path: ROUTES.SETTINGS },
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 6 }}
      py={3}
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
    >
      <Text
        fontSize="sm"
        fontWeight="700"
        letterSpacing="-0.02em"
        cursor="pointer"
        onClick={() => navigate('/')}
      >
        Invoice Generator
      </Text>
      <HStack gap={1}>
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? 'solid' : 'ghost'}
            size="xs"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </HStack>
    </Flex>
  );
};
