import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/supabase/products';

const BASE = 'https://creativitybylilyco.com';
const STATIC_PATHS = ['', '/products', '/about', '/events', '/contact', '/shipping', '/returns', '/privacy', '/terms'];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    slugs = (await getProducts()).map((p) => p.slug).filter(Boolean);
  } catch {
    // Still serve the static routes if the catalog query fails.
  }
  return [
    ...STATIC_PATHS.map((path) => ({ url: `${BASE}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...slugs.map((slug) => ({ url: `${BASE}/products/${slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
