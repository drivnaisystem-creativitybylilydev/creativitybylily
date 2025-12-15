import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();

  // Get unique customers from orders
  const { data: orders } = await supabase
    .from('orders')
    .select('customer_email, customer_first_name, customer_last_name, customer_phone')
    .not('customer_email', 'is', null);

  // Group by email to get unique customers
  const customerMap = new Map();
  orders?.forEach((order: any) => {
    if (order.customer_email && !customerMap.has(order.customer_email)) {
      customerMap.set(order.customer_email, {
        email: order.customer_email,
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
        phone: order.customer_phone,
        orderCount: 1,
      });
    } else if (order.customer_email) {
      const customer = customerMap.get(order.customer_email);
      customer.orderCount += 1;
    }
  });

  const customers = Array.from(customerMap.values());

  // Get total spent per customer
  const { data: allOrders } = await supabase
    .from('orders')
    .select('customer_email, total')
    .not('customer_email', 'is', null);

  customers.forEach((customer) => {
    const customerOrders = allOrders?.filter(
      (o: any) => o.customer_email === customer.email
    ) || [];
    customer.totalSpent = customerOrders.reduce(
      (sum: number, o: any) => sum + Number(o.total),
      0
    );
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">View and manage your customer database</p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer: any) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{customer.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{customer.orderCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[color:var(--logo-pink)]">
                        ${customer.totalSpent?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No customers yet</p>
            <p className="text-sm">Customers will appear here after they place orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}








