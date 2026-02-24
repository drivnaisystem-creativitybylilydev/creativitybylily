'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  productId: string;
  productTitle: string;
  /** 'icon' = small trash icon (for product cards), 'button' = full red button (for edit page) */
  variant?: 'icon' | 'button';
};

export default function DeleteProductButton({ productId, productTitle, variant = 'icon' }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      {variant === 'icon' ? (
        <button
          onClick={() => setShowConfirm(true)}
          title="Delete product"
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-6 py-3 rounded-full font-medium border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete Product
        </button>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete product?</h2>
            <p className="text-gray-600 text-sm mb-1">
              <span className="font-medium text-gray-800">{productTitle}</span> will be permanently removed.
            </p>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>

            {error && (
              <p className="text-red-600 text-sm mb-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setError(''); }}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
