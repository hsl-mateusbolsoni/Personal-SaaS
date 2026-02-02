import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    heading: `'Manrope', sans-serif`,
    body: `'Manrope', sans-serif`,
  },
  colors: {
    brand: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      500: '#000000',
      900: '#000000',
    },
  },
  components: {
    Button: {
      defaultProps: { size: 'sm', colorScheme: 'blackAlpha' },
    },
    Input: {
      defaultProps: { size: 'sm' },
    },
    Select: {
      defaultProps: { size: 'sm' },
    },
    Textarea: {
      defaultProps: { size: 'sm' },
    },
  },
  styles: {
    global: {
      body: { fontSize: 'sm' },
    },
  },
});
