'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import NotificationBadge from '@/components/admin/NotificationBadge';

const NAV_LINKS = [
  { href: '/admin/orders', label: 'Orders', badge: 'orders' as const },
  { href: '/admin/products', label: 'Products', badge: null },
  { href: '/admin/customers', label: 'Customers', badge: null },
  { href: '/admin/events', label: 'Events', badge: 'events' as const },
  { href: '/admin/returns', label: 'Returns', badge: 'returns' as const },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password';

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-gray-50">
        {!isAuthPage && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">

                {/* Left: logo + desktop nav */}
                <div className="flex items-center gap-8">
                  <Link href="/admin" className="text-xl sm:text-2xl font-bold text-[color:var(--logo-pink)]">
                    Admin
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map(({ href, label, badge }) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-gray-700 hover:text-[color:var(--logo-pink)] transition-colors font-medium relative"
                      >
                        {label}
                        {badge && <NotificationBadge type={badge} />}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Right: logout + view site + hamburger */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    View Site
                  </Link>
                  <div className="hidden md:block">
                    <AdminLogoutButton />
                  </div>
                  {/* Hamburger — mobile/tablet only */}
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                  >
                    {menuOpen ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
              <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
                <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
                  {NAV_LINKS.map(({ href, label, badge }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                        pathname.startsWith(href)
                          ? 'bg-pink-50 text-[color:var(--logo-pink)]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{label}</span>
                      {badge && (
                        <span className="relative">
                          <NotificationBadge type={badge} />
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
                    <Link
                      href="/"
                      className="px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      ← View Site
                    </Link>
                    <div className="px-4 pb-2">
                      <AdminLogoutButton />
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </header>
        )}

        <main className={isAuthPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}>
          {children}
        </main>
      </div>
    </AdminAuthWrapper>
  );
}
