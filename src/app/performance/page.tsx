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
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Performance Tracking</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Portfolios Tracked</p>
              <p className="text-3xl font-bold text-blue-600">{summary.total_portfolios}</p>
              <p className="text-sm text-gray-500 mt-2">
                {summary.tracked_portfolios} with actual returns
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Average Predicted Return</p>
              <p className="text-3xl font-bold text-green-600">
                {summary.avg_predicted_return.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Actual: {summary.avg_actual_return.toFixed(2)}%
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Model Accuracy</p>
              <p className="text-3xl font-bold text-purple-600">
                {summary.avg_accuracy.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Range: {summary.accuracy_range.min.toFixed(1)}% -{' '}
                {summary.accuracy_range.max.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Comparison Chart */}
        {records.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Predicted vs Actual Returns</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={records}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="portfolio_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predicted_return" fill="#3b82f6" name="Predicted %" />
                <Bar
                  dataKey="actual_return"
                  fill="#10b981"
                  name="Actual %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed Table */}
        {records.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Portfolio ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Predicted Return
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actual Return
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {record.portfolio_id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {record.predicted_return.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {record.actual_return !== null
                        ? `${record.actual_return.toFixed(2)}%`
                        : 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      {record.accuracy !== null
                        ? `${record.accuracy.toFixed(2)}%`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {records.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No performance data yet</p>
            <p className="text-sm text-gray-500">
              Generate and save portfolios to start tracking their performance
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Disclaimer</h3>
          <p className="text-sm text-yellow-800">
            This is an AI-based simulation and NOT financial advice. Past performance is not
            indicative of future results. Please consult with a financial advisor before making
            investment decisions. Actual returns may differ significantly from predictions.
          </p>
        </div>
      </div>
    </div>
  );
}
