'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type AnalyticsData = {
  kpis: {
    totalOrdersAllTime: number;
    totalOrdersInPeriod: number;
    totalLabels: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  orderStatusBreakdown: Array<{ status: string; count: number; percentage: number }>;
  carrierBreakdown: Array<{ carrier: string; count: number }>;
  ordersOverTime: Array<{ date: string; orders: number; revenue: number }>;
};

const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function periodLabel(range: '7d' | '30d' | '90d' | 'all'): string {
  if (range === '7d') return 'last 7 days';
  if (range === '30d') return 'last 30 days';
  if (range === '90d') return 'last 90 days';
  return 'all time';
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      });

      const response = await fetch(`/api/admin/analytics?${params}`);
      const analyticsData = await response.json();

      if (!response.ok) {
        throw new Error(analyticsData.error || 'Failed to fetch analytics');
      }

      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const onRefresh = () => {
      loadAnalytics();
    };
    window.addEventListener('admin-dashboard-refresh', onRefresh);
    return () => window.removeEventListener('admin-dashboard-refresh', onRefresh);
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  // Format orders over time for chart
  const chartData = data.ordersOverTime.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    orders: item.orders,
    revenue: Number(item.revenue.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap gap-2">
        {(['7d', '30d', '90d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:text-base ${
              dateRange === range
                ? 'bg-[color:var(--logo-pink)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'All Time'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total orders (all time)</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.kpis.totalOrdersAllTime}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {data.kpis.totalOrdersInPeriod} in {periodLabel(dateRange)} · charts use this range
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Shipping Labels</p>
              <p className="text-3xl font-bold text-purple-600">{data.kpis.totalLabels}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${data.kpis.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-[color:var(--logo-pink)]">${data.kpis.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Over Time */}
        <div className="min-w-0 max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Orders Over Time</h3>
          <div className="h-[260px] min-h-0 w-full min-w-0 max-w-full overflow-x-hidden sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="min-w-0 max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Status Breakdown</h3>
          <div className="h-[260px] min-h-0 w-full min-w-0 max-w-full overflow-x-hidden sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.orderStatusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="count"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.orderStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  `${value} (${props.payload.percentage.toFixed(1)}%)`,
                  props.payload.status
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => `${value} (${entry.payload.percentage.toFixed(1)}%)`}
              />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 - Carrier Breakdown */}
      {data.carrierBreakdown.length > 0 && (
        <div className="min-w-0 max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Shipping Labels by Carrier</h3>
          <div className="h-[260px] min-h-0 w-full min-w-0 max-w-full overflow-x-hidden sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.carrierBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="carrier" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}





