'use client';

/**
 * Downloads CSV of pending + processing orders for Rollo / manual fulfillment.
 */
export default function ExportOpenOrderAddressesButton() {
  return (
    <a
      href="/api/admin/orders/export-addresses"
      className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-stone-50"
    >
      Download addresses (CSV)
    </a>
  );
}
