import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MarkAsViewed from '@/components/admin/MarkAsViewed';
import DeleteOrderButtonInline from '@/components/admin/DeleteOrderButtonInline';

/** Always fresh list (avoid stale empty state after new orders). */
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading orders: {error.message}</p>
      </div>
    );
  }

  // Mark all orders as viewed when admin visits this page
  const orderIds = orders?.map((o: any) => o.id) || [];

  return (
    <div>
      <MarkAsViewed type="orders" ids={orderIds} />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {orders && orders.length > 0 ? (
          <div className="min-w-0 p-2 sm:p-0">
            <table className="admin-table-stack w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Order #">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-[color:var(--logo-pink)] hover:opacity-80"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-4 sm:px-6" data-label="Customer">
                      <div className="text-sm text-gray-900">
                        {order.customer_first_name} {order.customer_last_name}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                      {order.customer_phone && (
                        <div className="text-xs text-gray-400">{order.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap sm:px-6" data-label="Items">
                      -
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Status">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap sm:px-6"
                      data-label="Total"
                    >
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6" data-label="Date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-sm sm:px-6" data-label="Actions">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-[color:var(--logo-pink)] hover:opacity-80"
                        >
                          View →
                        </Link>
                        <DeleteOrderButtonInline orderId={order.id} orderNumber={order.order_number} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No orders yet</p>
            <p className="text-sm">Orders will appear here once customers start placing them.</p>
          </div>
        )}
      </div>
    </div>
  );
}








