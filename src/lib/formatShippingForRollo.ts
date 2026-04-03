/**
 * Format order shipping JSON for pasting into the Rollo app / USPS flows.
 * Expects checkout shape: camelCase (firstName, address, address2, city, state, zip, country, phone).
 */
export type ShippingAddressInput = {
  firstName?: string;
  lastName?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
} | null;

/** Multi-line block for clipboard (matches a typical USPS label layout). */
export function formatAddressMultiline(addr: ShippingAddressInput): string {
  if (!addr) return '';
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim();
  const line1 = (addr.address || '').trim();
  const line2 = (addr.address2 || '').trim();
  const city = (addr.city || '').trim();
  const st = (addr.state || '').trim();
  const zip = (addr.zip || '').trim();
  const country = (addr.country || '').trim();
  const phone = (addr.phone || '').trim();
  const cityLine = [city, st, zip].filter(Boolean).join(', ');

  const lines = [name, line1, ...(line2 ? [line2] : []), cityLine];
  const c = country.toLowerCase();
  if (country && c !== 'us' && c !== 'usa' && country !== 'United States') {
    lines.push(country);
  }
  if (phone) lines.push(phone);
  return lines.filter((l) => l.length > 0).join('\n');
}

/** Single line — some forms use one recipient field. */
export function formatAddressSingleLine(addr: ShippingAddressInput): string {
  const block = formatAddressMultiline(addr);
  return block.replace(/\n+/g, ', ');
}

function csvEscape(value: string): string {
  const v = value ?? '';
  if (/[",\r\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export type RolloCsvRow = {
  order_number: string;
  name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
};

export function addressToCsvRow(
  orderNumber: string,
  email: string,
  addr: ShippingAddressInput,
  fallbackPhone?: string | null
): RolloCsvRow | null {
  if (!addr) return null;
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim();
  if (!name && !(addr.address || '').trim()) return null;
  return {
    order_number: orderNumber,
    name: name || '',
    address_line1: (addr.address || '').trim(),
    address_line2: (addr.address2 || '').trim(),
    city: (addr.city || '').trim(),
    state: (addr.state || '').trim(),
    zip: (addr.zip || '').trim(),
    country: (addr.country || 'US').trim(),
    phone: (addr.phone || fallbackPhone || '').trim(),
    email: email || '',
  };
}

export const ROLLO_CSV_HEADER = [
  'order_number',
  'name',
  'address_line1',
  'address_line2',
  'city',
  'state',
  'zip',
  'country',
  'phone',
  'email',
] as const;

export function rowsToCsv(rows: RolloCsvRow[]): string {
  const lines = [
    ROLLO_CSV_HEADER.join(','),
    ...rows.map((r) =>
      [
        csvEscape(r.order_number),
        csvEscape(r.name),
        csvEscape(r.address_line1),
        csvEscape(r.address_line2),
        csvEscape(r.city),
        csvEscape(r.state),
        csvEscape(r.zip),
        csvEscape(r.country),
        csvEscape(r.phone),
        csvEscape(r.email),
      ].join(',')
    ),
  ];
  return lines.join('\r\n');
}
