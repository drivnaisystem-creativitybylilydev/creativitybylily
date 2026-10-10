import { pageMetadata } from '@/lib/seo';

export const generateMetadata = pageMetadata('/products', { title: 'Shop All Jewelry' });

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
