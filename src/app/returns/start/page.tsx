'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

type Order = {
  id: string;
  order_number: string;
  total: number;
  created_at: string;
  status: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      title: string;
      image_url: string;
    };
  }>;
};

export default function StartReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login?redirect=/returns/start');
          return;
        }
        setUser(session.user);

        // Fetch user orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                id,
                title,
                image_url
              )
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData as Order[]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      setError('Please select an order');
      return;
    }

    if (selectedItems.size === 0) {
      setError('Please select at least one item to return');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const returnItems = selectedOrder.order_items
        .filter(item => selectedItems.has(item.id))
        .map(item => ({
          order_item_id: item.id,
          quantity: item.quantity,
          product_id: item.products.id,
          price: item.price,
        }));

      const refundAmount = returnItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Get session token to send with request
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        setError('You must be logged in to submit a return. Please log in and try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting return:', {
        orderId: selectedOrder.id,
        returnItemsCount: returnItems.length,
        refundAmount,
        hasToken: !!currentSession.access_token,
      });

      const response = await fetch('/api/returns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`,
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          returnItems,
          reason: reason || null,
          refundAmount,
        }),
      });

      const data = await response.json();

      console.log('Return API response:', { status: response.status, ok: response.ok, data });

      if (!response.ok) {
        console.error('Return creation failed:', data);
        throw new Error(data.error || data.details || 'Failed to create return request');
      }

      // Success - redirect to return confirmation
      router.push(`/returns/confirmation?return=${data.returnNumber}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/returns" className="text-[color:var(--logo-pink)] hover:underline mb-4 inline-block">
            ← Back to Returns Policy
          </Link>
          <h1 className="font-serif text-5xl font-light text-gray-900 mb-2">Start a Return</h1>
          <p className="text-gray-600">Select an order and items you'd like to return</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {/* Step 1: Select Order */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Step 1: Select Order</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">You don't have any orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrder(order);
                      setSelectedItems(new Set());
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedOrder?.id === order.id
                        ? 'border-[color:var(--logo-pink)] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Select Items */}
          {selectedOrder && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Step 2: Select Items to Return</h2>
              <div className="space-y-3">
                {selectedOrder.order_items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItems.has(item.id)
                        ? 'border-[color:var(--logo-pink)] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleItemToggle(item.id)}
                      className="mt-1 w-5 h-5 text-[color:var(--logo-pink)] border-gray-300 rounded focus:ring-[color:var(--logo-pink)]"
                    />
                    <div className="flex-1 flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.products?.image_url || '/placeholder.jpg'}
                          alt={item.products?.title || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.products?.title || 'Product'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-[color:var(--logo-pink)] mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Reason (Optional) */}
          {selectedOrder && selectedItems.size > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Step 3: Reason for Return (Optional)</h2>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)]"
              >
                <option value="">Select a reason (optional)</option>
                <option value="changed_mind">Changed my mind</option>
                <option value="not_as_described">Not as described</option>
                <option value="defective">Defective/Damaged</option>
                <option value="wrong_item">Wrong item received</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          {selectedOrder && selectedItems.size > 0 && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
              <Link
                href="/returns"
                className="px-8 py-4 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}



