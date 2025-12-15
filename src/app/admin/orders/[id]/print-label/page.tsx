'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

/**
 * Dedicated print page that automatically triggers print dialog
 * This page is opened when a label needs to be printed
 */
export default function PrintLabelPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [labelUrl, setLabelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the shipment label URL
    const fetchLabel = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}/shipment`);
        const data = await response.json();
        
        if (data.labelUrl) {
          setLabelUrl(data.labelUrl);
        } else {
          setError('No label found for this order');
        }
      } catch (err) {
        setError('Failed to load label');
      }
    };

    if (orderId) {
      fetchLabel();
    }
  }, [orderId]);

  useEffect(() => {
    // Auto-print when label URL is loaded
    if (labelUrl) {
      // Create iframe to load PDF
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = labelUrl;
      document.body.appendChild(iframe);

      // Wait for PDF to load, then print
      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.print();
          } catch (e) {
            // Fallback: open in new window and print
            window.open(labelUrl, '_blank')?.print();
          }
        }, 1000);
      };

      // Fallback: try printing after delay
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch (e) {
          window.open(labelUrl, '_blank')?.print();
        }
      }, 2000);
    }
  }, [labelUrl]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Preparing label for printing...</p>
        {labelUrl && (
          <iframe
            src={labelUrl}
            className="hidden"
            title="Shipping Label"
          />
        )}
      </div>
    </div>
  );
}





