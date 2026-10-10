import { createAdminClient } from '@/lib/supabase/server';

/** Server-side source of truth for what an order costs. The browser's numbers are never trusted. */
export const FREE_SHIPPING_THRESHOLD = 35;
export const FLAT_SHIPPING_COST = 6;
export const TAX_RATE = 0.0625;

export type CheckoutItemInput = { productId: string; variantId?: string | null; quantity: number };

export type PricedItem = {
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  title: string;
};

export type OrderTotals = {
  items: PricedItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  totalCents: number;
};

export class CheckoutPricingError extends Error {
  status: number;
  details?: string[];
  constructor(message: string, status = 400, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const toCents = (n: number) => Math.round(n * 100);

/** Prices the cart from the database and checks stock. Throws CheckoutPricingError on anything off. */
export async function computeOrderTotals(rawItems: unknown): Promise<OrderTotals> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutPricingError('Cart is empty');
  }
  if (rawItems.length > 50) throw new CheckoutPricingError('Too many items in the cart');

  const requested: CheckoutItemInput[] = rawItems.map((i: any) => ({
    productId: String(i?.productId ?? ''),
    variantId: i?.variantId ? String(i.variantId) : null,
    quantity: Number(i?.quantity),
  }));

  for (const r of requested) {
    if (!r.productId || !Number.isInteger(r.quantity) || r.quantity < 1 || r.quantity > 99) {
      throw new CheckoutPricingError('Invalid item in the cart');
    }
  }

  const supabase = createAdminClient();
  const ids = [...new Set(requested.map((r) => r.productId))];
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, price, variants, inventory_count')
    .in('id', ids);

  if (error) throw new CheckoutPricingError('Failed to validate your cart', 500);

  // Stock is tracked per product, so quantities for the same product add up before the check.
  const wanted = new Map<string, number>();
  for (const r of requested) wanted.set(r.productId, (wanted.get(r.productId) ?? 0) + r.quantity);

  const stockErrors: string[] = [];
  for (const [id, qty] of wanted) {
    const p = products?.find((x) => x.id === id);
    if (!p) {
      stockErrors.push(`Product not found: ${id}`);
    } else if ((p.inventory_count || 0) < qty) {
      stockErrors.push(`${p.title}: Only ${p.inventory_count || 0} available, but ${qty} requested`);
    }
  }
  if (stockErrors.length) {
    throw new CheckoutPricingError('Insufficient inventory', 400, stockErrors);
  }

  const items: PricedItem[] = requested.map((r) => {
    const p = products!.find((x) => x.id === r.productId)!;
    let modifier = 0;
    if (r.variantId) {
      const variants = Array.isArray(p.variants) ? (p.variants as any[]) : [];
      const v = variants.find((x) => x?.id === r.variantId);
      if (!v) throw new CheckoutPricingError(`${p.title}: that option is no longer available`);
      modifier = Number(v.price_modifier) || 0;
    }
    return {
      productId: r.productId,
      variantId: r.variantId ?? null,
      quantity: r.quantity,
      unitPrice: (toCents(Number(p.price)) + toCents(modifier)) / 100,
      title: p.title,
    };
  });

  const subtotalCents = items.reduce((n, i) => n + toCents(i.unitPrice) * i.quantity, 0);
  const subtotal = subtotalCents / 100;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + toCents(shipping) + taxCents;

  return { items, subtotal, shipping, tax: taxCents / 100, total: totalCents / 100, totalCents };
}
