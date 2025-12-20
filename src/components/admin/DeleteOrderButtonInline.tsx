'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

interface DeleteOrderButtonInlineProps {
  orderId: string;
  orderNumber: string;
}

export default function DeleteOrderButtonInline({ orderId, orderNumber }: DeleteOrderButtonInlineProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete order');
      }

      setToast({ message: `Order ${orderNumber} deleted successfully`, type: 'success' });

      setTimeout(() => {
        router.push('/admin/orders');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete order. Please try again.', type: 'error' });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Delete order ${orderNumber}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Order"
        message={`Delete order ${orderNumber}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}



