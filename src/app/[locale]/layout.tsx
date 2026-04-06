import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthErrorHandler from '@/components/AuthErrorHandler';
import { Analytics } from '@vercel/analytics/react';
import LocaleHtmlLang from '@/components/LocaleHtmlLang';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang />
      <a href="#main-content" className="skip-link">
        {t('skipToMain')}
      </a>
      <AuthErrorHandler />
      <CartProvider>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="main-content" className="site-main w-full flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
      <Analytics />
    </NextIntlClientProvider>
  );
}
