import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createAdminClient();

    // All-time order count (never filtered by date — matches "every order in the system")
    const { count: totalOrdersAllTime, error: countAllTimeError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (countAllTimeError) {
      return NextResponse.json(
        { error: countAllTimeError.message || 'Failed to count orders' },
        { status: 500 }
      );
    }

    // Build date filter for charts / period KPIs
    let ordersQuery = supabase.from('orders').select('*');
    let shipmentsQuery = supabase.from('shipments').select('*');

    if (startDate) {
      ordersQuery = ordersQuery.gte('created_at', startDate);
      shipmentsQuery = shipmentsQuery.gte('created_at', startDate);
    }
    if (endDate) {
      ordersQuery = ordersQuery.lte('created_at', endDate);
      shipmentsQuery = shipmentsQuery.lte('created_at', endDate);
    }

    // Fetch orders and shipments for the selected window
    const { data: orders, error: ordersError } = await ordersQuery;
    const { data: shipments, error: shipmentsError } = await shipmentsQuery;

    if (ordersError || shipmentsError) {
      return NextResponse.json(
        { error: ordersError?.message || shipmentsError?.message || 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Period-scoped KPIs (charts use the same filtered `orders` array)
    const totalOrdersInPeriod = orders?.length || 0;
    const totalLabels = shipments?.filter(s => s.status === 'purchased').length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0;
    const averageOrderValue =
      totalOrdersInPeriod > 0 ? totalRevenue / totalOrdersInPeriod : 0;

    // Order status breakdown
    const statusCounts: Record<string, number> = {};
    orders?.forEach((order) => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Carrier breakdown
    const carrierCounts: Record<string, number> = {};
    shipments?.forEach(shipment => {
      if (shipment.carrier && shipment.status === 'purchased') {
        carrierCounts[shipment.carrier] = (carrierCounts[shipment.carrier] || 0) + 1;
      }
    });

    // Orders over time (group by day)
    const ordersByDate: Record<string, { date: string; orders: number; revenue: number }> = {};
    orders?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = { date, orders: 0, revenue: 0 };
      }
      ordersByDate[date].orders += 1;
      ordersByDate[date].revenue += Number(order.total || 0);
    });

    // Convert to array and sort by date
    const ordersOverTime = Object.values(ordersByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      kpis: {
        totalOrdersAllTime: totalOrdersAllTime ?? 0,
        totalOrdersInPeriod,
        totalLabels,
        totalRevenue,
        averageOrderValue,
      },
      orderStatusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage:
          totalOrdersInPeriod > 0 ? (count / totalOrdersInPeriod) * 100 : 0,
      })),
      carrierBreakdown: Object.entries(carrierCounts).map(([carrier, count]) => ({
        carrier: carrier.toUpperCase(),
        count,
      })),
      ordersOverTime,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}





