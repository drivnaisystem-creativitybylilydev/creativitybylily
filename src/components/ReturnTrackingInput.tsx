'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ReturnTrackingInput({
  returnId,
  returnNumber,
  currentStatus,
  currentTracking,
}: {
  returnId: string;
  returnNumber: string;
  currentStatus: string;
  currentTracking: string | null;
}) {
  const [trackingNumber, setTrackingNumber] = useState(currentTracking || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Only show input if return is approved and no tracking has been added yet
  if (currentStatus !== 'approved' && currentStatus !== 'shipped') {
    return null;
  }

  if (currentTracking && currentStatus === 'shipped') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-1">Tracking Number</p>
        <p className="text-sm text-blue-800 font-mono">{currentTracking}</p>
        <p className="text-xs text-blue-700 mt-2">Your return has been shipped. Status updated automatically.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to add tracking information.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`/api/returns/${returnId}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add tracking number');
      }

      setSuccess(true);
      // Reload page after a short delay to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add tracking number. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Add Tracking Number</h4>
      <p className="text-xs text-gray-600 mb-3">
        Once you've shipped your return, add the tracking number here. The return status will automatically update to "Shipped".
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-green-800">Tracking number added successfully! Status updated to "Shipped".</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)]"
          required
          disabled={isSubmitting || success}
        />
        <button
          type="submit"
          disabled={isSubmitting || success || !trackingNumber.trim()}
          className="w-full bg-[color:var(--logo-pink)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : success ? 'Added!' : 'Add Tracking Number'}
        </button>
      </form>
    </div>
  );
}


