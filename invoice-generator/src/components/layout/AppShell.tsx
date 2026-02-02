import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Header } from './Header';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <Box minH="100vh" bg="gray.50">
    <Header />
    <Box as="main">{children}</Box>
  </Box>
);
