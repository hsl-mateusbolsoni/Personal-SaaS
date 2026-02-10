import { Grid, GridItem, Show } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <Grid
    templateColumns={{ base: '1fr', md: '220px 1fr' }}
    minH="100vh"
  >
    <Show above="md">
      <GridItem
        as="aside"
        bg="white"
        borderRight="1px solid"
        borderColor="brand.100"
      >
        <Sidebar />
      </GridItem>
    </Show>
    <GridItem
      as="main"
      bg="brand.50"
      overflowX="auto"
    >
      {children}
    </GridItem>
  </Grid>
);
