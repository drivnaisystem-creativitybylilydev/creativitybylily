'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ReturnConfirmationPage() {
  const searchParams = useSearchParams();
  const returnNumber = searchParams.get('return');
  const [returnData, setReturnData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!returnNumber) return;

    const fetchReturn = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('returns')
          .select('*')
          .eq('return_number', returnNumber)
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setReturnData(data);
      } catch (error) {
        console.error('Error fetching return:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturn();
  }, [returnNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl font-light text-gray-900 mb-4">Return Not Found</h1>
          <Link href="/returns" className="text-[color:var(--logo-pink)] hover:underline">
            Back to Returns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl font-light text-gray-900 mb-2">Return Request Submitted</h1>
            <p className="text-gray-600">Your return request has been received and is pending admin approval.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Return Number:</span>
                <span className="font-semibold text-gray-900">{returnData.return_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  returnData.status === 'pending' ? 'text-yellow-600' :
                  returnData.status === 'approved' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {returnData.status.charAt(0).toUpperCase() + returnData.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refund Amount:</span>
                <span className="font-semibold text-gray-900">${returnData.refund_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <p className="text-blue-800 text-sm">
              Your return request is pending admin approval. Once approved, you'll receive an email with return shipping instructions. 
              You are responsible for return shipping costs. After we receive and inspect your items, your refund will be processed 
              within 5-7 business days to your original payment method.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/account"
              className="bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              View My Account
            </Link>
            <Link
              href="/returns"
              className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Returns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
