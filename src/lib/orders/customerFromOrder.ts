/**
 * Resolve customer identity from denormalized order columns and/or shipping_address JSON.
 * Checkout stores camelCase keys (email, firstName, lastName, phone) in shipping_address.
 */

export type ResolvedCustomerRow = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function trimStr(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.trim();
}

function firstNonEmpty(...vals: unknown[]): string {
  for (const v of vals) {
    const s = trimStr(v);
    if (s) return s;
  }
  return '';
}

function normalizeEmail(v: unknown): string | null {
  const s = trimStr(v).toLowerCase();
  return s || null;
}

/**
 * Returns null if no usable email (top-level or in shipping JSON).
 */
export function resolveCustomerFromOrder(order: {
  customer_email?: string | null;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_phone?: string | null;
  shipping_address?: unknown;
}): ResolvedCustomerRow | null {
  const ship = asRecord(order.shipping_address);

  const email =
    normalizeEmail(order.customer_email) ??
    normalizeEmail(ship?.email) ??
    normalizeEmail(ship?.Email);

  if (!email) return null;

  const firstName = firstNonEmpty(
    order.customer_first_name,
    ship?.firstName,
    ship?.first_name,
    ship?.given_name
  );

  const lastName = firstNonEmpty(
    order.customer_last_name,
    ship?.lastName,
    ship?.last_name,
    ship?.family_name
  );

  const phone = firstNonEmpty(order.customer_phone, ship?.phone, ship?.Phone);

  return { email, firstName, lastName, phone };
}
