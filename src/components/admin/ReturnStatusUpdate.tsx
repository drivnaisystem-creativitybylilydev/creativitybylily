'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ReturnStatus = 'pending' | 'approved' | 'shipped' | 'received' | 'processed' | 'refunded' | 'rejected';

export default function ReturnStatusUpdate({
  returnId,
  currentStatus,
}: {
  returnId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReturnStatus>(currentStatus as ReturnStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleStatusChange = async (newStatus: ReturnStatus) => {
    setIsUpdating(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/returns/${returnId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setStatus(newStatus);
      setSuccess(true);
      router.refresh();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions: { value: ReturnStatus; label: string; description: string }[] = [
    { value: 'pending', label: 'Pending', description: 'Awaiting admin review' },
    { value: 'approved', label: 'Approved', description: 'Return approved, customer can ship' },
    { value: 'shipped', label: 'Shipped', description: 'Customer has shipped items back' },
    { value: 'received', label: 'Received', description: 'Items received, inspecting' },
    { value: 'processed', label: 'Processed', description: 'Inspection complete, ready for refund' },
    { value: 'refunded', label: 'Refunded', description: 'Refund processed' },
    { value: 'rejected', label: 'Rejected', description: 'Return request rejected' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">Status updated successfully!</p>
        </div>
      )}

      <div className="space-y-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={isUpdating || status === option.value}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
              status === option.value
                ? 'border-[color:var(--logo-pink)] bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-600">{option.description}</p>
              </div>
              {status === option.value && (
                <svg className="w-5 h-5 text-[color:var(--logo-pink)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


