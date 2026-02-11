import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Users, Gear } from 'phosphor-react';
import { ROUTES } from '../../config/routes';

const NAV_ITEMS = [
  { label: 'Invoices', path: ROUTES.DASHBOARD, icon: FileText },
  { label: 'Clients', path: ROUTES.CLIENTS, icon: Users },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Gear },
];

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path || location.pathname.startsWith('/invoice');
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="brand.100"
      py={2}
      px={4}
      zIndex={100}
      display={{ base: 'block', md: 'none' }}
    >
      <Flex justify="space-around" align="center">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Flex
              key={item.path}
              as="button"
              direction="column"
              align="center"
              gap={1}
              py={1}
              px={4}
              borderRadius="lg"
              transition="all 0.15s"
              onClick={() => navigate(item.path)}
              color={active ? 'accent.600' : 'brand.500'}
              _active={{ transform: 'scale(0.95)' }}
            >
              <Icon size={22} weight={active ? 'fill' : 'regular'} />
              <Text fontSize="xs" fontWeight={active ? '600' : '500'}>
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
