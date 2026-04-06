'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { AppLocale } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-1.5 text-sm text-[color:var(--logo-pink)]">
      <span className="sr-only">{t('label')}</span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as AppLocale;
          router.replace(pathname, { locale: next });
        }}
        className="max-w-[9rem] cursor-pointer rounded-md border border-pink-200/80 bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--logo-pink)] md:text-sm"
        aria-label={t('label')}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </label>
  );
}
