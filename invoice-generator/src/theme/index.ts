import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    heading: `'Manrope', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Manrope', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  colors: {
    brand: {
      50: '#f5f5f5',
      100: '#e5e5e5',
      200: '#d4d4d4',
      300: '#a3a3a3',
      400: '#737373',
      500: '#525252',
      600: '#404040',
      700: '#262626',
      800: '#171717',
      900: '#0a0a0a',
    },
    accent: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
      },
      sizes: {
        sm: {
          h: '32px',
          px: 3,
          fontSize: 'sm',
        },
        md: {
          h: '40px',
          px: 4,
          fontSize: 'sm',
        },
        lg: {
          h: '48px',
          px: 6,
          fontSize: 'md',
        },
      },
      variants: {
        solid: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
          },
          _active: {
            bg: 'accent.700',
          },
        },
        ghost: {
          color: 'brand.600',
          _hover: {
            bg: 'brand.50',
          },
        },
        outline: {
          borderColor: 'brand.200',
          color: 'brand.700',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
      defaultProps: { size: 'sm', variant: 'solid' },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'brand.200',
            _hover: {
              borderColor: 'brand.300',
            },
            _focus: {
              borderColor: 'accent.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
            },
          },
        },
      },
      defaultProps: { size: 'sm' },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
        },
      },
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'brand.200',
            _hover: {
              borderColor: 'brand.300',
            },
            _focus: {
              borderColor: 'accent.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
            },
          },
        },
      },
      defaultProps: { size: 'sm' },
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'white',
          borderColor: 'brand.200',
          borderRadius: 'lg',
          _hover: {
            borderColor: 'brand.300',
          },
          _focus: {
            borderColor: 'accent.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
          },
        },
      },
      defaultProps: { size: 'sm' },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 2,
        py: 0.5,
        fontWeight: '500',
        fontSize: 'xs',
        textTransform: 'capitalize',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: 'xl',
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderRadius: 'lg',
          shadow: 'lg',
          border: '1px solid',
          borderColor: 'brand.100',
          py: 1,
        },
        item: {
          fontSize: 'sm',
          _hover: {
            bg: 'brand.50',
          },
          _focus: {
            bg: 'brand.50',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        fontSize: 'sm',
        bg: 'brand.50',
        color: 'brand.800',
      },
    },
  },
});
