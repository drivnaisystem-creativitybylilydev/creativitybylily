'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_ITEMS = [
  { href: '/', key: 'home' as const },
  { href: '/products', key: 'shop' as const },
  { href: '/events', key: 'events' as const },
  { href: '/about', key: 'about' as const },
  { href: '/contact', key: 'contact' as const },
];

export default function Header() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(
    () => NAV_ITEMS.map((item) => ({ ...item, label: tNav(item.key) })),
    [tNav]
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleMenuKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener('keydown', handleMenuKeyDown);
      return () => document.removeEventListener('keydown', handleMenuKeyDown);
    }
  }, [mobileOpen, handleMenuKeyDown]);

  return (
    <header
      className="site-header sticky top-0 z-50 border-b border-pink-200"
      style={{ backgroundColor: 'var(--soft-pink)' }}
    >
      <div className="mx-auto flex min-w-0 max-w-7xl items-center gap-2 px-4 py-3 safe-area-x sm:gap-3 sm:px-6 md:py-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex shrink-0 rounded-lg p-2 text-[color:var(--logo-pink)] md:hidden"
          aria-label={tCommon('openMenu')}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3 md:min-w-0">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/70 ring-1 ring-pink-200 sm:h-12 sm:w-12 md:h-14 md:w-14">
            <Image
              src="/brand_logo.webp"
              alt={tCommon('brandAria')}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span className="truncate font-[family-name:var(--font-script)] text-lg leading-none text-[color:var(--logo-pink)] sm:text-xl md:text-2xl">
            {tCommon('brandName')}
          </span>
        </Link>

        <nav className="ml-auto mr-auto hidden min-w-0 flex-1 items-center justify-center gap-6 text-lg font-serif md:flex lg:gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 text-[color:var(--logo-pink)] transition-opacity hover:opacity-80"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <SearchBar />
          <a
            href="https://www.instagram.com/creativitybylily.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-[color:var(--logo-pink)] transition-opacity hover:opacity-80 sm:inline-flex"
            aria-label={tCommon('instagram')}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/account"
                  className="text-[color:var(--logo-pink)] transition-opacity hover:opacity-80"
                  aria-label={tCommon('myAccount')}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href="/login"
                    className="whitespace-nowrap text-sm font-medium text-[color:var(--logo-pink)] transition-opacity hover:opacity-80"
                  >
                    {tCommon('signIn')}
                  </Link>
                  <Link
                    href="/signup"
                    className="whitespace-nowrap text-sm font-medium text-[color:var(--logo-pink)] transition-opacity hover:opacity-80"
                  >
                    {tCommon('signUp')}
                  </Link>
                </div>
              )}
            </>
          )}
          <CartIcon />
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label={tCommon('closeMenu')}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-[min(20rem,calc(100vw-3rem))] max-w-full flex-col bg-[var(--soft-pink)] shadow-xl safe-area-x"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center justify-between border-b border-pink-200/80 px-3 py-3">
              <span id="mobile-menu-title" className="font-[family-name:var(--font-script)] text-lg text-[color:var(--logo-pink)]">
                {tCommon('menu')}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-[color:var(--logo-pink)]"
                aria-label={tCommon('closeMenu')}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
              <div className="px-4 py-2 md:hidden">
                <LanguageSwitcher />
              </div>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-[color:var(--logo-pink)] transition-colors hover:bg-white/40"
                >
                  {label}
                </Link>
              ))}
              {!isLoading && !user && (
                <div className="mt-4 border-t border-pink-200/80 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-[color:var(--logo-pink)] hover:bg-white/40"
                  >
                    {tCommon('signIn')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-[color:var(--logo-pink)] hover:bg-white/40"
                  >
                    {tCommon('signUp')}
                  </Link>
                </div>
              )}
              <a
                href="https://www.instagram.com/creativitybylily.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-medium text-[color:var(--logo-pink)] hover:bg-white/40"
              >
                {tCommon('instagram')}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
