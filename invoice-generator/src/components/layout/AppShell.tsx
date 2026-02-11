import { Box, Grid, GridItem } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <Grid
    templateColumns={{ base: '1fr', md: '220px 1fr' }}
    minH="100vh"
  >
    <GridItem
      as="aside"
      bg="white"
      borderRight="1px solid"
      borderColor="brand.100"
      display={{ base: 'none', md: 'block' }}
    >
      <Sidebar />
    </GridItem>
    <GridItem
      as="main"
      bg="brand.50"
      overflowX="auto"
    >
      <Box pb={{ base: '72px', md: 0 }}>
        {children}
      </Box>
    </GridItem>
    <Box display={{ base: 'block', md: 'none' }}>
      <MobileNav />
    </Box>
  </Grid>
);
