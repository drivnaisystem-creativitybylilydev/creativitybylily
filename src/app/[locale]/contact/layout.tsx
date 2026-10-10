import { pageMetadata } from '@/lib/seo';

export const generateMetadata = pageMetadata('/contact', { title: 'Contact' });

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
