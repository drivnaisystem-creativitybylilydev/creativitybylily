import { routing } from '@/i18n/routing';

const BASE = 'https://creativitybylilyco.com';

/** Absolute canonical URL for a page. English keeps clean URLs; de/es get a locale prefix. */
export function canonicalUrl(locale: string, path = ''): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${BASE}${prefix}${path}` || BASE;
}

type LocaleParams = { params: Promise<{ locale: string }> };

/** Builds a generateMetadata() for a static page: its fields plus a self-referencing canonical. */
export function pageMetadata(path: string, fields: Record<string, unknown>) {
  return async ({ params }: LocaleParams) => {
    const { locale } = await params;
    return { ...fields, alternates: { canonical: canonicalUrl(locale, path) } };
  };
}
