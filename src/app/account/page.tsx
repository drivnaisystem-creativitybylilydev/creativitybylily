'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import ReturnTrackingInput from '@/components/ReturnTrackingInput';
import type { Product } from '@/lib/supabase/types';

type Order = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
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

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
};

type Return = {
  id: string;
  return_number: string;
  status: string;
  refund_amount: number;
  return_tracking_number: string | null;
  created_at: string;
  orders: {
    order_number: string;
  };
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'profile'>('orders');

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Get user profile
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Get user orders
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

        // Get user returns
        const { data: returnsData } = await supabase
          .from('returns')
          .select(`
            *,
            orders (
              order_number
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (returnsData) {
          setReturns(returnsData as Return[]);
        }

        // Fetch featured products for carousel
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (productsData) {
          setProducts(productsData as Product[]);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-serif text-5xl font-light text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-[color:var(--logo-pink)] text-[color:var(--logo-pink)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'returns'
                  ? 'border-[color:var(--logo-pink)] text-[color:var(--logo-pink)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Returns {returns.length > 0 && `(${returns.length})`}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-[color:var(--logo-pink)] text-[color:var(--logo-pink)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12">
                <p className="text-gray-600 mb-6 text-center">You haven't placed any orders yet.</p>
                
                {/* Horizontal Product Carousel */}
                {products.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-serif text-2xl font-light text-gray-900 mb-4 text-center">
                      Discover Our Collection
                    </h3>
                    <div className="relative overflow-hidden">
                      <div className="flex gap-6 animate-scroll">
                        {/* Duplicate products for seamless loop */}
                        {[...products, ...products].map((product, index) => (
                          <Link
                            key={`${product.id}-${index}`}
                            href={`/products/${product.slug}`}
                            className="group flex-shrink-0 w-64"
                          >
                            <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100">
                              <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="256px"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="font-medium text-base text-gray-800 line-clamp-2 mt-3 text-center">
                              {product.title}
                            </h4>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.products?.image_url || '/placeholder.jpg'}
                                alt={item.products?.title || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {item.products?.title || 'Product'}
                              </p>
                              <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-sm font-medium text-[color:var(--logo-pink)] mt-1">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        href={`/checkout/confirmation?order=${order.order_number}`}
                        className="text-sm text-[color:var(--logo-pink)] hover:underline"
                      >
                        View Order Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Returns Tab */}
        {activeTab === 'returns' && (
          <div>
            {returns.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-600 mb-6">You don't have any return requests yet.</p>
                <Link
                  href="/returns"
                  className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Start a Return
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {returns.map((returnItem) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'pending':
                        return 'bg-yellow-100 text-yellow-800';
                      case 'approved':
                        return 'bg-blue-100 text-blue-800';
                      case 'shipped':
                        return 'bg-purple-100 text-purple-800';
                      case 'received':
                        return 'bg-indigo-100 text-indigo-800';
                      case 'processed':
                        return 'bg-green-100 text-green-800';
                      case 'refunded':
                        return 'bg-gray-100 text-gray-800';
                      case 'rejected':
                        return 'bg-red-100 text-red-800';
                      default:
                        return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <div key={returnItem.id} className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Return #{returnItem.return_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Order #{returnItem.orders?.order_number || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Requested on {new Date(returnItem.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            ${returnItem.refund_amount.toFixed(2)}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                              returnItem.status
                            )}`}
                          >
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Tracking Input Component */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <ReturnTrackingInput
                          returnId={returnItem.id}
                          returnNumber={returnItem.return_number}
                          currentStatus={returnItem.status}
                          currentTracking={returnItem.return_tracking_number}
                        />
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link
                          href={`/returns/confirmation?return=${returnItem.return_number}`}
                          className="text-sm text-[color:var(--logo-pink)] hover:underline"
                        >
                          View Return Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{profile?.email || user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
              <button
                onClick={handleSignOut}
                className="px-6 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Danger Zone</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <DeleteAccountButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



