'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestEmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState('order');
  const [sendTo, setSendTo] = useState('');
  const [sendType, setSendType] = useState('order');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; message: string } | null>(null);

  const emailTypes = [
    { value: 'order', label: 'Order Confirmation', description: 'Sent when customer places an order' },
    {
      value: 'admin-new-order',
      label: 'Admin: New order alert',
      description: 'Sent to ADMIN_ORDER_NOTIFY_EMAIL when a sale completes',
    },
    { value: 'shipping', label: 'Shipping Confirmation', description: 'Sent when order ships' },
    { value: 'return-request', label: 'Return Request Received', description: 'Sent when customer submits return' },
    { value: 'return-approved', label: 'Return Approved', description: 'Sent when admin approves return' },
    { value: 'refund', label: 'Refund Processed', description: 'Sent when refund is processed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Template Preview</h1>
          <p className="text-gray-600">
            Preview all email templates. Click on an email type to view it in a new tab.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Email Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTypes.map((email) => (
              <a
                key={email.value}
                href={`/api/test/emails?type=${email.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{email.label}</h3>
                <p className="text-sm text-gray-600">{email.description}</p>
                <span className="text-xs text-pink-600 mt-2 inline-block">
                  Click to preview →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📧 Send test email (no real order)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sends one real email to your inbox using sample data. Only works in development (not on production).
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!sendTo.trim()) return;
              setSending(true);
              setSendResult(null);
              try {
                const res = await fetch('/api/test/emails', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ to: sendTo.trim(), type: sendType }),
                });
                const data = await res.json();
                if (res.ok) {
                  setSendResult({ ok: true, message: `Sent! Check ${sendTo} (and spam folder).` });
                } else {
                  setSendResult({ ok: false, message: data.error || data.details?.message || 'Failed to send' });
                }
              } catch (err: any) {
                setSendResult({ ok: false, message: err.message || 'Request failed' });
              } finally {
                setSending(false);
              }
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Send to</span>
              <input
                type="email"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="you@example.com"
                className="border border-gray-300 rounded-lg px-3 py-2 w-64"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Template</span>
              <select
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                {emailTypes.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={sending}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send test email'}
            </button>
          </form>
          {sendResult && (
            <p className={`mt-3 text-sm ${sendResult.ok ? 'text-green-700' : 'text-red-700'}`}>
              {sendResult.message}
            </p>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Preview only</h3>
          <p className="text-sm text-yellow-800 mb-2">
            The links above open the template as HTML in the browser (no email is sent). Use the form above to send a real test to your inbox.
          </p>
          <p className="text-sm text-yellow-800">
            Ensure <code className="bg-yellow-100 px-1 rounded">RESEND_API_KEY</code> and <code className="bg-yellow-100 px-1 rounded">RESEND_FROM_EMAIL</code> are in <code className="bg-yellow-100 px-1 rounded">.env.local</code> and restart the dev server.
          </p>
        </div>
      </div>
    </div>
  );
}








