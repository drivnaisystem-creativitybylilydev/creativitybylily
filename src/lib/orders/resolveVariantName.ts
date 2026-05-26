import type { ProductVariant } from '@/lib/supabase/types';

/** Human-readable option label from product.variants JSON and order_items.variant_id. */
export function resolveVariantName(
  variants: unknown,
  variantId: string | null | undefined
): string | null {
  if (!variantId || !Array.isArray(variants)) return null;
  const match = (variants as ProductVariant[]).find((v) => v.id === variantId);
  const name = match?.name?.trim();
  return name || null;
}
