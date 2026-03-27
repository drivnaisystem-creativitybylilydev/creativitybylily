import { createServerClient, createAdminClient } from './server';
import { Product } from './types';

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc' | 'bestseller';

const VALID_CATEGORIES = ['earrings', 'necklaces', 'bracelets', 'anklets'] as const;

/**
 * Sum sold quantities per product from order_items (requires service role — RLS blocks anon).
 * Returns empty map if service key is missing or query fails.
 */
async function getSalesTotalsByProductId(): Promise<Map<string, number>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('order_items').select('product_id, quantity');
    if (error || !data) return new Map();
    const map = new Map<string, number>();
    for (const row of data) {
      const id = row.product_id as string;
      const qty = Number(row.quantity) || 0;
      map.set(id, (map.get(id) || 0) + qty);
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Fetch active products with optional category, title search, and sort.
 * Best seller uses real order line totals when SUPABASE_SERVICE_ROLE_KEY is configured.
 */
export async function getProductsListing(options: {
  category?: string | null;
  search?: string | null;
  sort?: ProductSortOption | null;
}): Promise<Product[]> {
  const supabase = createServerClient();
  const sort: ProductSortOption = options.sort || 'newest';
  const rawQ = options.search?.trim() ?? '';

  let query = supabase.from('products').select('*').eq('is_active', true);

  const cat = options.category?.toLowerCase();
  if (cat && cat !== 'all' && VALID_CATEGORIES.includes(cat as (typeof VALID_CATEGORIES)[number])) {
    query = query.eq('category', cat);
  }

  if (rawQ.length > 0) {
    const safe = rawQ.replace(/%/g, '').replace(/_/g, ' ').slice(0, 100);
    if (safe.length > 0) {
      query = query.ilike('title', `%${safe}%`);
    }
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products listing:', error);
    return [];
  }

  let products = (data || []) as Product[];

  if (sort === 'bestseller') {
    const sales = await getSalesTotalsByProductId();
    products = [...products].sort((a, b) => {
      const sa = sales.get(a.id) || 0;
      const sb = sales.get(b.id) || 0;
      if (sb !== sa) return sb - sa;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return products;
}

/** Top products by sales order (for BESTSELLER badges). Empty sales → recent-first order from listing. */
export async function getBestsellerProductIdSet(limit = 36): Promise<Set<string>> {
  const products = await getProductsListing({ sort: 'bestseller' });
  return new Set(products.slice(0, limit).map((p) => p.id));
}

/**
 * Fetch all active products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  return getProductsListing({ sort: 'newest' });
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: 'earrings' | 'necklaces' | 'bracelets' | 'anklets'): Promise<Product[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch related products (same category, excluding current product)
 */
export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 6
): Promise<Product[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}








