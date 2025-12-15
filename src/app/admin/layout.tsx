'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show header on auth pages
  const isAuthPage = pathname === '/admin/login' || 
                     pathname === '/admin/forgot-password' || 
                     pathname === '/admin/reset-password';

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header - only show on non-auth pages */}
        {!isAuthPage && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/admin" className="text-2xl font-bold text-[color:var(--logo-pink)]">
                    Admin Dashboard
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/admin/orders"
                      className="text-gray-700 hover:text-[color:var(--logo-pink)] transition-colors font-medium"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="text-gray-700 hover:text-[color:var(--logo-pink)] transition-colors font-medium"
                    >
                      Products
                    </Link>
                    <Link
                      href="/admin/customers"
                      className="text-gray-700 hover:text-[color:var(--logo-pink)] transition-colors font-medium"
                    >
                      Customers
                    </Link>
                    <Link
                      href="/admin/events"
                      className="text-gray-700 hover:text-[color:var(--logo-pink)] transition-colors font-medium"
                    >
                      Events
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <AdminLogoutButton />
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    View Site
                  </Link>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={isAuthPage ? '' : 'max-w-7xl mx-auto px-6 py-8'}>
          {children}
        </main>
      </div>
    </AdminAuthWrapper>
  );
}
