'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';

export default function DeleteAccountButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);

    try {
      // Get session token to send with request
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        setToast({ message: 'You must be logged in to delete your account.', type: 'error' });
        setIsDeleting(false);
        return;
      }

      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      setToast({ message: 'Account deleted successfully', type: 'success' });

      // Sign out and redirect to home
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete account. Please try again.', type: 'error' });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Account
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Account"
        message="Permanently delete your account? This cannot be undone."
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


