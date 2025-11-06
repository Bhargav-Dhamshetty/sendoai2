// System Logs Viewer Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { LogsService } from '@/lib/logs-service';
import type { SystemLog } from '@/lib/types';
import { format } from 'date-fns';

export default function LogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [severity, setSeverity] = useState('all');
  const pageSize = 20;

  useEffect(() => {
    loadLogs();
  }, [page, severity]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { logs: logData, total: totalCount } = await LogsService.getLogs(
        page,
        pageSize,
        severity
      );
      setLogs(logData);
      setTotal(totalCount);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      critical: 'bg-purple-100 text-purple-800',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Head>
        <title>Sendora AI - System Logs</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📋 System Logs</h1>
                <p className="text-gray-600 mt-1">Monitor errors and system events</p>
              </div>
              <a href="/" className="btn-secondary">
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by severity:</label>
              <select
                value={severity}
                onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
              <div className="ml-auto text-sm text-gray-600">
                Showing {logs.length} of {total} logs
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="card">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-gray-600">Loading logs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{log.error_type}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{log.error_message}</p>
                    {log.error_stack && (
                      <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer hover:text-primary">Stack Trace</summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                          {log.error_stack}
                        </pre>
                      </details>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Request ID: {log.request_id}</span>
                      {log.resolved && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
