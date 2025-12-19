import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MarkAsViewed from '@/components/admin/MarkAsViewed';

export default async function AdminReturnsPage() {
  const supabase = createAdminClient();

  const { data: returns, error } = await supabase
    .from('returns')
    .select(`
      *,
      orders (
        order_number,
        customer_email,
        customer_first_name,
        customer_last_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading returns: {error.message}</p>
      </div>
    );
  }

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

  // Mark all returns as viewed when admin visits this page
  const returnIds = returns?.map((r: any) => r.id) || [];

  return (
    <div>
      <MarkAsViewed type="returns" ids={returnIds} />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">Returns</h1>
          <p className="text-gray-600">Manage customer return requests</p>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {returns && returns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Return #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returns.map((returnItem: any) => {
                  const order = returnItem.orders;
                  const returnItems = Array.isArray(returnItem.return_items) 
                    ? returnItem.return_items 
                    : [];
                  const itemCount = returnItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

                  return (
                    <tr key={returnItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{returnItem.return_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${returnItem.order_id}`}
                          className="text-[color:var(--logo-pink)] hover:underline"
                        >
                          {order?.order_number || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order?.customer_first_name && order?.customer_last_name
                              ? `${order.customer_first_name} ${order.customer_last_name}`
                              : order?.customer_email || 'N/A'}
                          </div>
                          {order?.customer_email && (
                            <div className="text-sm text-gray-500">{order.customer_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${returnItem.refund_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            returnItem.status
                          )}`}
                        >
                          {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(returnItem.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/returns/${returnItem.id}`}
                          className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-600">No return requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
