import { createAdminClient } from '@/lib/supabase/server';
import { resolveCustomerFromOrder } from '@/lib/orders/customerFromOrder';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 1000;

type OrderRow = {
  customer_email: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  shipping_address: unknown;
  total: number | string | null;
};

async function fetchAllOrdersForCustomers(supabase: ReturnType<typeof createAdminClient>) {
  const rows: OrderRow[] = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from('orders')
      .select('customer_email, customer_first_name, customer_last_name, customer_phone, shipping_address, total')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return { rows: null as OrderRow[] | null, error };
    }

    const batch = (data || []) as OrderRow[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return { rows, error: null as null };
}

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();

  const { rows: orders, error } = await fetchAllOrdersForCustomers(supabase);

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-light text-gray-900 sm:text-4xl">Customers</h1>
          <p className="text-gray-600">View and manage your customer database</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Error loading orders: {error.message}</p>
        </div>
      </div>
    );
  }

  const customerMap = new Map<
    string,
    {
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      orderCount: number;
      totalSpent: number;
    }
  >();

  for (const order of orders || []) {
    const resolved = resolveCustomerFromOrder(order);
    if (!resolved) continue;

    const total = Number(order.total ?? 0);
    const existing = customerMap.get(resolved.email);
    if (!existing) {
      customerMap.set(resolved.email, {
        email: resolved.email,
        firstName: resolved.firstName,
        lastName: resolved.lastName,
        phone: resolved.phone,
        orderCount: 1,
        totalSpent: total,
      });
    } else {
      existing.orderCount += 1;
      existing.totalSpent += total;
      if (!existing.firstName && resolved.firstName) existing.firstName = resolved.firstName;
      if (!existing.lastName && resolved.lastName) existing.lastName = resolved.lastName;
      if (!existing.phone && resolved.phone) existing.phone = resolved.phone;
    }
  }

  const customers = Array.from(customerMap.values());

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-light text-gray-900 sm:text-4xl">Customers</h1>
        <p className="text-gray-600">
          Unique buyers derived from orders (email from order fields or shipping address).
        </p>
      </div>

      <div className="max-w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {customers.length > 0 ? (
          <div className="min-w-0 p-2 sm:p-0">
            <table className="admin-table-stack w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-4 py-4 sm:px-6" data-label="Name">
                      <div className="text-sm font-medium text-gray-900">
                        {[customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6" data-label="Email">
                      <div className="break-anywhere text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Phone">
                      <div className="text-sm text-gray-600">{customer.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Orders">
                      <div className="text-sm font-medium text-gray-900">{customer.orderCount}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Total Spent">
                      <div className="text-sm font-semibold text-[color:var(--logo-pink)]">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-2 text-lg">No customers yet</p>
            <p className="text-sm">
              We could not find an email on any order (neither saved customer columns nor{' '}
              <code className="rounded bg-gray-100 px-1">shipping_address</code>). If you expect buyers here, run the
              diagnostic SQL in <code className="rounded bg-gray-100 px-1">supabase/diagnose-customers-from-orders.sql</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
