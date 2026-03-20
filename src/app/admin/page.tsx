import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AdminDashboardRefresh from '@/components/admin/AdminDashboardRefresh';
import MarkAsViewed from '@/components/admin/MarkAsViewed';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [{ data: orders }, { count: totalOrderCount, error: countError }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  const orderTotal = countError ? null : totalOrderCount ?? 0;
  const recentIds = orders?.map((o: { id: string }) => o.id) || [];

  return (
    <div>
      <MarkAsViewed type="orders" ids={recentIds} />
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your e-commerce store</p>
          {orderTotal !== null && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium text-gray-700">{orderTotal}</span> order
              {orderTotal === 1 ? '' : 's'} in the database · red badge = orders not yet opened on the full{' '}
              <Link href="/admin/orders" className="text-[color:var(--logo-pink)] hover:underline">
                Orders
              </Link>{' '}
              page
            </p>
          )}
        </div>
        <AdminDashboardRefresh />
      </div>

      {/* Analytics Dashboard with Charts */}
      <AnalyticsDashboard />

      {/* Recent Orders Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent orders</h2>
            {orderTotal !== null && (
              <p className="text-sm text-gray-500 mt-1">
                Showing {orders?.length ?? 0} most recent
                {orderTotal > (orders?.length ?? 0)
                  ? ` · ${orderTotal} total — open Orders for the full list`
                  : ''}
              </p>
            )}
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity font-medium whitespace-nowrap"
          >
            View all orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {orders && orders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-[color:var(--logo-pink)] hover:opacity-80"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customer_first_name} {order.customer_last_name}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




