import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => (
  <Box maxW="1100px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
    {children}
  </Box>
);
