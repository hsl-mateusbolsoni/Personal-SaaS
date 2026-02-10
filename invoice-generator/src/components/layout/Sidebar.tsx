import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Receipt, FileText, Users, Gear } from 'phosphor-react';
import { ROUTES } from '../../config/routes';

const NAV_ITEMS = [
  { label: 'Invoices', path: ROUTES.DASHBOARD, icon: FileText },
  { label: 'Clients', path: ROUTES.CLIENTS, icon: Users },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Gear },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path || location.pathname.startsWith('/invoice');
    }
    return location.pathname === path;
  };

  return (
    <Box
      as="nav"
      h="100vh"
      py={6}
      px={3}
      position="sticky"
      top={0}
    >
      <Flex
        align="center"
        gap={2}
        px={3}
        mb={8}
        cursor="pointer"
        onClick={() => navigate('/')}
        _hover={{ opacity: 0.8 }}
      >
        <Receipt size={24} weight="duotone" color="#6366f1" />
        <Text fontSize="md" fontWeight="700" color="brand.800">
          Invoicer
        </Text>
      </Flex>

      <VStack align="stretch" gap={1}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Flex
              key={item.path}
              as="button"
              align="center"
              gap={3}
              px={3}
              py={2.5}
              fontSize="sm"
              fontWeight={active ? '600' : '500'}
              color={active ? 'accent.600' : 'brand.600'}
              bg={active ? 'accent.50' : 'transparent'}
              borderRadius="lg"
              transition="all 0.15s"
              onClick={() => navigate(item.path)}
              _hover={{
                bg: active ? 'accent.50' : 'brand.50',
              }}
            >
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              {item.label}
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
};
