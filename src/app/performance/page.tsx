'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Header from '@/components/Header';

interface PerformanceRecord {
  email: string;
  portfolio_id: string;
  predicted_return: number;
  actual_return: number | null;
  accuracy: number | null;
  created_at: string;
  checked_at: string | null;
}

interface PerformanceSummary {
  total_portfolios: number;
  tracked_portfolios: number;
  avg_predicted_return: number;
  avg_actual_return: number;
  avg_accuracy: number;
  accuracy_range: {
    min: number;
    max: number;
  };
}

export default function PerformanceTracking() {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch performance records
        const recordsRes = await fetch(
          'http://localhost:8000/compare-performance?portfolio_id=recent',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch performance summary
        const summaryRes = await fetch(
          'http://localhost:8000/performance-summary',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }

        if (recordsRes.ok) {
          const recordsData = await recordsRes.json();
          setRecords(recordsData.items || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--background)' }}>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p style={{ color: 'var(--foreground-secondary)' }}>Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>Performance Tracking</h1>

        {error && (
          <div className="border rounded-lg p-4 mb-8" style={{ backgroundColor: 'var(--danger-muted)', borderColor: 'var(--danger)' }}>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Total Portfolios Tracked</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--info)' }}>{summary.total_portfolios}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--foreground-muted)' }}>
                {summary.tracked_portfolios} with actual returns
              </p>
            </div>

            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Average Predicted Return</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>
                {summary.avg_predicted_return.toFixed(2)}%
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--foreground-muted)' }}>
                Actual: {summary.avg_actual_return.toFixed(2)}%
              </p>
            </div>

            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Model Accuracy</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
                {summary.avg_accuracy.toFixed(2)}%
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--foreground-muted)' }}>
                Range: {summary.accuracy_range.min.toFixed(1)}% -{' '}
                {summary.accuracy_range.max.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Comparison Chart */}
        {records.length > 0 && (
          <div className="rounded-lg p-6 mb-12 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Predicted vs Actual Returns</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={records}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="portfolio_id" stroke="var(--foreground-secondary)" />
                <YAxis stroke="var(--foreground-secondary)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="predicted_return" fill="var(--info)" name="Predicted %" />
                <Bar
                  dataKey="actual_return"
                  fill="var(--success)"
                  name="Actual %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed Table */}
        {records.length > 0 && (
          <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }} className="border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Portfolio ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Predicted Return
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Actual Return
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr key={idx} className="border-b hover:border-border-hover" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--foreground-secondary)' }}>
                      {record.portfolio_id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--success)' }}>
                      {record.predicted_return.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--info)' }}>
                      {record.actual_return !== null
                        ? `${record.actual_return.toFixed(2)}%`
                        : 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                      {record.accuracy !== null
                        ? `${record.accuracy.toFixed(2)}%`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {records.length === 0 && (
          <div className="rounded-lg p-12 text-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="mb-4" style={{ color: 'var(--foreground-secondary)' }}>No performance data yet</p>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Generate and save portfolios to start tracking their performance
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-lg p-6 border" style={{ backgroundColor: 'var(--warning-muted)', borderColor: 'var(--warning)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--warning)' }}>⚠️ Disclaimer</h3>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            This is an AI-based simulation and NOT financial advice. Past performance is not
            indicative of future results. Please consult with a financial advisor before making
            investment decisions. Actual returns may differ significantly from predictions.
          </p>
        </div>
      </div>
    </div>
  );
}
