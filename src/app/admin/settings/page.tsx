'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/supabase/admin-fetch';

export default function AdminSettingsPage() {
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setPaused(data.settings.store_paused);
          setMessage(data.settings.pause_message || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (nextPaused: boolean) => {
    setSaving(true);
    setSavedAt(null);
    try {
      const response = await adminFetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_paused: nextPaused, pause_message: message.trim() || null }),
      });
      if (response.ok) {
        setPaused(nextPaused);
        setSavedAt(new Date().toLocaleTimeString());
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading settings…</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Store Settings</h1>
      <p className="text-gray-600 mb-8">Temporarily pause the shop without touching any code.</p>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Shop is currently {paused ? 'closed' : 'open'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              When closed, the homepage, shop, product pages, cart, and checkout show a
              &ldquo;back soon&rdquo; page. Order tracking and returns stay open for existing customers.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={paused}
            onClick={() => handleSave(!paused)}
            disabled={saving}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              paused ? 'bg-[color:var(--logo-pink)]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                paused ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message shown on the &ldquo;back soon&rdquo; page
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="We're taking a short break to restock and get ready for what's next. Our online shop will reopen soon — thank you for your patience!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to use the default message above.</p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => handleSave(paused)}
            disabled={saving}
            className="bg-[color:var(--logo-pink)] text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save message'}
          </button>
          {savedAt && <span className="text-sm text-gray-500">Saved at {savedAt}</span>}
        </div>
      </div>
    </div>
  );
}
