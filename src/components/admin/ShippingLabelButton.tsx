'use client';

import { useState } from 'react';

interface ShippingLabelButtonProps {
  orderId: string;
  orderNumber: string;
  shippingAddress: any;
  orderItems: any[];
  hasTracking: boolean;
  shipment?: {
    label_url?: string | null;
    tracking_number?: string | null;
    carrier?: string | null;
    service_level_name?: string | null;
    shipping_cost?: number | null;
    status?: string;
  } | null;
}

export default function ShippingLabelButton({
  orderId,
  orderNumber,
  shippingAddress,
  orderItems,
  hasTracking,
  shipment,
}: ShippingLabelButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePrintLabel = () => {
    if (shipment?.label_url) {
      // Open Shippo label PDF in new window and auto-trigger print
      const printWindow = window.open(shipment.label_url, '_blank');
      
      // Wait for PDF to load, then trigger print dialog
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500); // Small delay to ensure PDF is fully loaded
        };
        
        // Fallback: if onload doesn't fire (some PDFs), try after a delay
        setTimeout(() => {
          try {
            printWindow.print();
          } catch (e) {
            console.log('Auto-print not available, user can print manually');
          }
        }, 1500);
      }
    }
  };

  const handleGenerateLabel = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/generate-label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          shippingAddress,
          orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate shipping label');
      }

      // If we got a label URL from Shippo, open it in a new window and auto-trigger print
      if (data.labelUrl) {
        // Open PDF and automatically trigger print dialog
        const printWindow = window.open(data.labelUrl, '_blank');
        
        // Wait for PDF to load, then trigger print dialog
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500); // Small delay to ensure PDF is fully loaded
          };
          
          // Fallback: if onload doesn't fire (some PDFs), try after a delay
          setTimeout(() => {
            try {
              printWindow.print();
            } catch (e) {
              console.log('Auto-print not available, user can print manually');
            }
          }, 1500);
        }
      }

      setSuccess(true);
      
      // Refresh page after 2 seconds to show updated tracking number and shipment info
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate shipping label');
      if (err.details) {
        console.error('Shippo error details:', err.details);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const hasExistingLabel = shipment?.label_url && shipment?.status === 'purchased';

  return (
    <div className="space-y-2">
      {hasExistingLabel ? (
        <>
          <button
            onClick={handlePrintLabel}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print to Rollo (Auto-print)</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-1">
            Print dialog will open automatically. Select Rollo printer and click Print.
          </p>
          {shipment.carrier && (
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Carrier:</span> {shipment.carrier.toUpperCase()}</p>
              {shipment.service_level_name && (
                <p><span className="font-medium">Service:</span> {shipment.service_level_name}</p>
              )}
              {shipment.shipping_cost && (
                <p><span className="font-medium">Cost:</span> ${Number(shipment.shipping_cost).toFixed(2)}</p>
              )}
            </div>
          )}
          <button
            onClick={handleGenerateLabel}
            disabled={isGenerating}
            className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Regenerating...' : 'Regenerate Label'}
          </button>
        </>
      ) : (
        <button
          onClick={handleGenerateLabel}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Label...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Generate Shipping Label</span>
            </>
          )}
        </button>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 font-medium">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">Success!</p>
          <p className="text-sm text-green-700 mt-1">Label generated successfully. Opening for printing...</p>
        </div>
      )}
    </div>
  );
}


