'use client';

import { useState } from 'react';
import {
  formatAddressMultiline,
  formatAddressSingleLine,
  type ShippingAddressInput,
} from '@/lib/formatShippingForRollo';

type RolloAddressHelperProps = {
  shippingAddress: ShippingAddressInput;
  orderNumber: string;
  customerEmail: string;
  customerPhone?: string | null;
};

async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function RolloAddressHelper({
  shippingAddress,
  orderNumber,
  customerEmail,
  customerPhone,
}: RolloAddressHelperProps) {
  const [flash, setFlash] = useState<string | null>(null);

  const multiline = formatAddressMultiline(shippingAddress);
  const singleLine = formatAddressSingleLine(shippingAddress);

  const onCopy = async (label: string, text: string) => {
    const ok = await copyText(text);
    setFlash(ok ? label : 'Could not copy — copy manually');
    setTimeout(() => setFlash(null), 2200);
  };

  if (!multiline) {
    return <p className="text-sm text-amber-800">No shipping address on this order.</p>;
  }

  return (
    <div className="mt-5 border-t border-stone-200 pt-5">
      <h3 className="text-sm font-semibold text-gray-900">Ship with Rollo app</h3>
      <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
        Buy the label in Rollo like you already do—use these to paste the address so you don&apos;t retype it.
        This doesn&apos;t create a second shipping account; it just pulls from the order.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => onCopy('Address copied', multiline)}
          className="rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-900"
        >
          Copy address (multi-line)
        </button>
        <button
          type="button"
          onClick={() => onCopy('Single line copied', singleLine)}
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-stone-50"
        >
          Copy address (one line)
        </button>
        <button
          type="button"
          onClick={() =>
            onCopy(
              'Order note copied',
              `Order ${orderNumber}\n${customerEmail}${customerPhone ? `\n${customerPhone}` : ''}`
            )
          }
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-stone-50"
        >
          Copy order # + contact
        </button>
      </div>
      {flash && (
        <p
          className={`mt-2 text-xs font-medium ${flash.startsWith('Could not') ? 'text-red-700' : 'text-green-700'}`}
          role="status"
        >
          {flash}
        </p>
      )}
      <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
        Tip: On the Orders list you can download a CSV of open orders (pending / processing) for bulk import if Rollo
        supports it—column names are generic so you can map them in Rollo or a spreadsheet.
      </p>
    </div>
  );
}
