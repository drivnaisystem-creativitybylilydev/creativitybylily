import { createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReturnStatusUpdate from '@/components/admin/ReturnStatusUpdate';

export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Get return with order details
  const { data: returnRequest, error: returnError } = await supabase
    .from('returns')
    .select(`
      *,
      orders (
        *,
        order_items (
          *,
          products (
            id,
            title,
            image_url,
            price
          )
        )
      )
    `)
    .eq('id', id)
    .single();

  if (returnError || !returnRequest) {
    notFound();
  }

  const order = returnRequest.orders as any;
  const returnItems = Array.isArray(returnRequest.return_items) 
    ? returnRequest.return_items 
    : [];

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
    <div>
      <div className="mb-8">
        <Link
          href="/admin/returns"
          className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity mb-4 inline-block"
        >
          ← Back to Returns
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Return #{returnRequest.return_number}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(returnRequest.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span
            className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
              returnRequest.status
            )}`}
          >
            {returnRequest.status.charAt(0).toUpperCase() + returnRequest.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Return Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Items to Return</h2>
            <div className="space-y-4">
              {returnItems.map((item: any, index: number) => {
                // Find matching order item for product details
                const orderItem = order?.order_items?.find((oi: any) => oi.id === item.order_item_id);
                const product = orderItem?.products;

                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                        {product?.title || 'Product'}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">Quantity: {item.quantity || 1}</p>
                      <p className="text-base font-bold text-[color:var(--logo-pink)]">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Return Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="text-gray-900 font-medium">
                  {returnRequest.reason 
                    ? returnRequest.reason.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                    : 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refund Amount:</span>
                <span className="text-gray-900 font-bold text-lg">
                  ${returnRequest.refund_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Shipping Cost:</span>
                <span className="text-gray-900 font-medium">
                  ${returnRequest.return_shipping_cost.toFixed(2)} (Customer pays)
                </span>
              </div>
              {returnRequest.return_tracking_number && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="text-gray-900 font-medium">{returnRequest.return_tracking_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Order */}
          {order && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Order</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <Link
                    href={`/admin/orders/${returnRequest.order_id}`}
                    className="text-[color:var(--logo-pink)] hover:underline font-medium"
                  >
                    {order.order_number}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="text-gray-900 font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <ReturnStatusUpdate returnId={returnRequest.id} currentStatus={returnRequest.status} />

          {/* Return Address */}
          {returnRequest.return_address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {returnRequest.return_address.name && (
                  <p className="font-medium text-gray-900">{returnRequest.return_address.name}</p>
                )}
                <p>{returnRequest.return_address.address || returnRequest.return_address.address_line_1}</p>
                {returnRequest.return_address.address2 && (
                  <p>{returnRequest.return_address.address2}</p>
                )}
                <p>
                  {returnRequest.return_address.city}, {returnRequest.return_address.state}{' '}
                  {returnRequest.return_address.zip}
                </p>
                <p>{returnRequest.return_address.country}</p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
            {returnRequest.admin_notes ? (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{returnRequest.admin_notes}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


