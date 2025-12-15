import { createServerClient } from './server';
import { Product } from './types';

/**
 * Fetch all active products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
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
export async function getProductsByCategory(category: 'earrings' | 'necklaces' | 'bracelets'): Promise<Product[]> {
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








