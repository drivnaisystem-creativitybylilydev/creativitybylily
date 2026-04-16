'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrderTrackingFulfillment({
  orderId,
  initialTracking,
  currentStatus,
  shipmentCarrier,
  shipmentTrackingStatus,
}: {
  orderId: string;
  initialTracking: string | null;
  currentStatus: OrderStatus;
  shipmentCarrier?: string | null;
  shipmentTrackingStatus?: string | null;
}) {
  const router = useRouter();
  const [tracking, setTracking] = useState(initialTracking?.trim() || '');

  useEffect(() => {
    setTracking(initialTracking?.trim() || '');
  }, [initialTracking]);
  const [busy, setBusy] = useState<'save' | 'ship' | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const isShipped = currentStatus === 'shipped';
  const trimmed = tracking.trim();
  const hasTracking = Boolean(trimmed || (initialTracking?.trim() ?? ''));

  async function patchStatus(body: { status: OrderStatus; tracking_number?: string | null }) {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  const handleSaveTrackingOnly = async () => {
    setBusy('save');
    setMessage(null);
    try {
      await patchStatus({
        status: currentStatus,
        tracking_number: trimmed || null,
      });
      setMessage({ type: 'ok', text: 'Tracking number saved.' });
      router.refresh();
    } catch (e: unknown) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : 'Could not save tracking.' });
    } finally {
      setBusy(null);
    }
  };

  const handleMarkShipped = async () => {
    setBusy('ship');
    setMessage(null);
    try {
      // Omit tracking when the field is empty so an existing label tracking number is not wiped.
      await patchStatus({
        status: 'shipped',
        ...(trimmed ? { tracking_number: trimmed } : {}),
      });
      setMessage({ type: 'ok', text: 'Order marked shipped. The customer was sent the shipping email.' });
      router.refresh();
    } catch (e: unknown) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : 'Could not mark shipped.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="font-semibold text-gray-900 mb-1">Tracking &amp; customer email</h3>
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        Enter the USPS / Rollo tracking number in the field below. The customer is only emailed when you click{' '}
        <strong>Mark as shipped &amp; email customer</strong> (saving the number alone does not send mail).
      </p>

      <label htmlFor={`tracking-${orderId}`} className="mb-1 block text-sm font-medium text-gray-800">
        Tracking number
      </label>
      <input
        id={`tracking-${orderId}`}
        type="text"
        inputMode="text"
        spellCheck={false}
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="e.g. 9400 0112 3456 7890 0000 12"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-[color:var(--logo-pink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)]/30"
        autoComplete="off"
      />

      {message && (
        <p
          className={`mt-2 text-sm ${message.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {!isShipped && (
          <button
            type="button"
            onClick={handleMarkShipped}
            disabled={busy !== null || !hasTracking}
            className="rounded-lg bg-[color:var(--logo-pink)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === 'ship' ? 'Working…' : 'Mark as shipped & email customer'}
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveTrackingOnly}
          disabled={busy !== null}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === 'save' ? 'Saving…' : isShipped ? 'Update tracking (no new email)' : 'Save tracking only'}
        </button>
      </div>

      {trimmed && (
        <a
          href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trimmed)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          Open USPS tracking →
        </a>
      )}

      {(shipmentCarrier || shipmentTrackingStatus) && (
        <p className="mt-2 text-xs text-gray-500">
          {shipmentCarrier && <span>Carrier (Shippo label): {shipmentCarrier.toUpperCase()}. </span>}
          {shipmentTrackingStatus && <span>Label status: {shipmentTrackingStatus}</span>}
        </p>
      )}
    </div>
  );
}
