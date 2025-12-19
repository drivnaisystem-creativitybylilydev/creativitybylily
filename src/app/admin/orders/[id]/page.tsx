import { createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate';
import ShippingLabelButton from '@/components/admin/ShippingLabelButton';
import DeleteOrderButton from '@/components/admin/DeleteOrderButton';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Get order with items
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  // Get order items with product details
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      *,
      products (
        id,
        title,
        image_url,
        price
      )
    `)
    .eq('order_id', id);

  // Get shipment information if it exists
  const { data: shipment } = await supabase
    .from('shipments')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const shippingAddress = order.shipping_address as any;
  const billingAddress = order.billing_address as any;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-sm text-gray-600 hover:text-[color:var(--logo-pink)] mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Order {order.order_number}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusUpdate orderId={id} currentStatus={order.status} />
            <DeleteOrderButton orderId={id} orderNumber={order.order_number} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderItems?.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.products?.image_url || '/placeholder.jpg'}
                      alt={item.products?.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.products?.title || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                    <p className="text-lg font-semibold text-[color:var(--logo-pink)]">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </p>
              <p>{shippingAddress?.address}</p>
              {shippingAddress?.address2 && <p>{shippingAddress.address2}</p>}
              <p>
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zip}
              </p>
              <p>{shippingAddress?.country}</p>
              {shippingAddress?.phone && (
                <p className="mt-2 text-sm text-gray-600">Phone: {shippingAddress.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {Number(order.shipping) === 0 ? 'Free' : `$${Number(order.shipping).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span className="font-semibold">${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-xl text-[color:var(--logo-pink)]">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Email:</span> {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {order.payment_intent_id && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
                <p className="text-sm text-gray-600">
                  Payment ID: <span className="font-mono text-xs">{order.payment_intent_id}</span>
                </p>
              </div>
            )}

            {/* Shipping Label */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Shipping Label</h3>
              <ShippingLabelButton
                orderId={id}
                orderNumber={order.order_number}
                shippingAddress={shippingAddress}
                orderItems={orderItems || []}
                hasTracking={!!order.tracking_number}
                shipment={shipment || null}
              />
            </div>

            {/* Tracking */}
            {order.tracking_number && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tracking Number</h3>
                <p className="text-sm text-gray-600 font-mono break-all">{order.tracking_number}</p>
                {shipment?.carrier && (
                  <p className="text-xs text-gray-500 mt-1">Carrier: {shipment.carrier.toUpperCase()}</p>
                )}
                {shipment?.tracking_status && (
                  <p className="text-xs text-gray-500">Status: {shipment.tracking_status}</p>
                )}
                <a
                  href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Track Package →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

