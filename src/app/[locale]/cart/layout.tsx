import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your Cart' };

// Client-only cart state (localStorage) has nothing to statically prerender,
// and Turbopack's build-time SSG pass duplicates the CartContext module
// boundary for fully-static client pages, which throws "must be used within
// CartProvider" even though the tree is correctly nested. Skip prerendering.
export const dynamic = 'force-dynamic';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
