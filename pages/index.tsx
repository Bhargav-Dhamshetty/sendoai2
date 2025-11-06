// Analytics Dashboard - Main Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnalyticsService } from '@/lib/analytics-service';
import type { AnalyticsSummary, ChartDataPoint, CallMetric } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallMetric[]>([]);
  const [dateRange, setDateRange] = useState({ days: 30 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange.days);

      const [summaryData, chartData, callsData] = await Promise.all([
        AnalyticsService.getAnalyticsSummary(startDate, endDate),
        AnalyticsService.getChartData(startDate, endDate),
        AnalyticsService.getRecentCalls(10),
      ]);

      setSummary(summaryData);
      setChartData(chartData);
      setRecentCalls(callsData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadDashboardData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sendora AI - Analytics Dashboard</title>
        <meta name="description" content="Real-time analytics for Sendora AI voice automation" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📊 Sendora AI Dashboard</h1>
                <p className="text-gray-600 mt-1">Real-time analytics & performance metrics</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={dateRange.days}
                  onChange={(e) => setDateRange({ days: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
                <a href="/logs" className="btn-secondary">
                  View Logs
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card border-l-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Calls</p>
                  <p className="text-3xl font-bold text-gray-900">{summary?.totalCalls || 0}</p>
                </div>
                <div className="text-4xl">📞</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Pickup Rate: <span className="font-semibold text-primary">{summary?.pickupRate}%</span>
              </p>
            </div>

            <div className="stat-card border-l-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{summary?.totalAppointments || 0}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Conversion: <span className="font-semibold text-success">{summary?.appointmentRate}%</span>
              </p>
            </div>

            <div className="stat-card border-l-info">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.floor((summary?.avgDuration || 0) / 60)}m</p>
                </div>
                <div className="text-4xl">⏱️</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {summary?.avgDuration || 0} seconds total
              </p>
            </div>

            <div className="stat-card border-l-warning">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Sentiment</p>
                  <p className="text-3xl font-bold text-gray-900">{summary?.avgSentiment || 0}</p>
                </div>
                <div className="text-4xl">😊</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Confidence: <span className="font-semibold text-warning">{summary?.avgConfidence}</span>
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Calls Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Calls Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calls" stroke="#667eea" strokeWidth={2} />
                  <Line type="monotone" dataKey="pickups" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="appointments" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Sentiment Score</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sentiment" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Calls</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prospect</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {call.prospect_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          call.appointment_booked 
                            ? 'bg-green-100 text-green-800' 
                            : call.pickup_status === 'picked_up'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {call.appointment_booked ? '✅ Booked' : call.pickup_status === 'picked_up' ? '📞 Pickup' : '❌ No Answer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.call_duration ? `${Math.floor(call.call_duration / 60)}m ${call.call_duration % 60}s` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.sentiment_score ? call.sentiment_score.toFixed(1) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.created_at ? format(new Date(call.created_at), 'MMM dd, HH:mm') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
