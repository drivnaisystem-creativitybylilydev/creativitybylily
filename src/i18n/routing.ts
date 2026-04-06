import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'es'],
  defaultLocale: 'en',
  /** English keeps clean URLs (/shop); German & Spanish use /de/... and /es/... */
  localePrefix: 'as-needed',
});

export type AppLocale = (typeof routing.locales)[number];
