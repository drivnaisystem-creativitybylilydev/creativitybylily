/** Carriers Lily can pick when marking an order shipped. Values match Shippo's carrier tokens (lowercase). */
export const SHIPPING_CARRIERS = [
  { value: 'usps', label: 'USPS' },
  { value: 'ups', label: 'UPS' },
  { value: 'fedex', label: 'FedEx' },
] as const;

export type ShippingCarrier = (typeof SHIPPING_CARRIERS)[number]['value'];

const CARRIER_VALUES = SHIPPING_CARRIERS.map((c) => c.value) as string[];

export function normalizeCarrier(carrier: string | null | undefined): ShippingCarrier {
  const lower = (carrier || '').toLowerCase().trim();
  return (CARRIER_VALUES.includes(lower) ? lower : 'usps') as ShippingCarrier;
}

export function getCarrierTrackingUrl(carrier: string | null | undefined, trackingNumber: string): string {
  const trimmed = trackingNumber.trim();
  switch (normalizeCarrier(carrier)) {
    case 'ups':
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(trimmed)}`;
    case 'fedex':
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trimmed)}`;
    case 'usps':
    default:
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trimmed)}`;
  }
}
