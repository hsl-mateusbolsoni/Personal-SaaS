import { createStandaloneToast } from '@chakra-ui/react';
import { theme } from '../theme';

const { toast: chakraToast } = createStandaloneToast({ theme });

interface ToastOptions {
  title: string;
  description?: string;
}

const defaultOptions = {
  duration: 3000,
  isClosable: true,
  position: 'bottom' as const,
};

export const toast = {
  success: ({ title, description }: ToastOptions) =>
    chakraToast({
      ...defaultOptions,
      title,
      description,
      status: 'success',
    }),

  error: ({ title, description }: ToastOptions) =>
    chakraToast({
      ...defaultOptions,
      title,
      description,
      status: 'error',
      duration: 5000,
    }),

  info: ({ title, description }: ToastOptions) =>
    chakraToast({
      ...defaultOptions,
      title,
      description,
      status: 'info',
    }),

  warning: ({ title, description }: ToastOptions) =>
    chakraToast({
      ...defaultOptions,
      title,
      description,
      status: 'warning',
      duration: 4000,
    }),
};
