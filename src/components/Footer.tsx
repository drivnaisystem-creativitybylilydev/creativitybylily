import Link from 'next/link';
import { Link as LocalizedLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import PrivacyEasterEggLink from './PrivacyEasterEggLink';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--soft-pink)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 safe-area-x sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <Link
              href="/admin/login"
              prefetch={false}
              className="group block mb-4 w-fit rounded-sm no-underline outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--logo-pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--soft-pink)]"
              aria-label={tCommon('brandAria')}
            >
              <h3 className="font-[family-name:var(--font-script)] text-2xl text-[color:var(--logo-pink)] mb-0 transition-opacity group-hover:opacity-85">
                {tCommon('brandName')}
              </h3>
            </Link>
            <p className="text-gray-900 text-sm leading-relaxed">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <LocalizedLink href="/" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {tNav('home')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/products" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {tNav('shop')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/about" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {tNav('about')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/contact" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {tNav('contact')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('customerService')}</h4>
            <ul className="space-y-2">
              <li>
                <LocalizedLink href="/returns" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {t('returns')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/account" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {t('myAccount')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/contact" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
                  {t('contactUs')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('followUs')}</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/creativitybylily.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors"
                aria-label={tCommon('instagram')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors"
                aria-label={tCommon('youtube')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[color:var(--logo-pink)] pt-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
            <PrivacyEasterEggLink />
            <span className="text-gray-400">•</span>
            <LocalizedLink href="/terms" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
              {t('terms')}
            </LocalizedLink>
            <span className="text-gray-400">•</span>
            <LocalizedLink href="/returns" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
              {t('returns')}
            </LocalizedLink>
            <span className="text-gray-400">•</span>
            <LocalizedLink href="/shipping" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
              {t('shipping')}
            </LocalizedLink>
            <span className="text-gray-400">•</span>
            <LocalizedLink href="/cookies" className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm">
              {t('cookies')}
            </LocalizedLink>
          </div>

          <div className="space-y-2 text-center text-sm text-gray-900">
            <p>{t('copyright', { year: currentYear })}</p>
            <p className="text-gray-600">
              {tCommon('poweredBy')}{' '}
              <a
                href="https://drivn-ai-website.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--logo-pink)] underline decoration-[color:var(--logo-pink)]/40 underline-offset-2 transition-opacity hover:opacity-80"
              >
                {tCommon('drivnAi')}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
