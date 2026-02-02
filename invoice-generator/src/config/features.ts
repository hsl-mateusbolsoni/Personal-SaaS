export const features = {
  payments: import.meta.env.VITE_FEATURE_PAYMENTS === 'true',
  recurring: import.meta.env.VITE_FEATURE_RECURRING === 'true',
  templates: import.meta.env.VITE_FEATURE_TEMPLATES === 'true',
  useApi: import.meta.env.VITE_USE_API === 'true',
};
