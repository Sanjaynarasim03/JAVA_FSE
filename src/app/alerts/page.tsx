'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { AlertCircle, TrendingDown, Target, CheckCircle } from 'lucide-react';

interface Alert {
  alert_id: string;
  type: string;
  ticker: string;
  trigger_value: string;
  current_value: string;
  message: string;
  status: string;
  created_at: string;
  resolved_at: string;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>(
    'ALL'
  );

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:8000/alerts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch alerts');

        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts =
    filterStatus === 'ALL'
      ? alerts
      : alerts.filter((a) => a.status === filterStatus);

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const resolvedCount = alerts.filter((a) => a.status === 'RESOLVED').length;

  const getAlertIcon = (type: string) => {
    return type === 'PRICE_DROP' ? (
      <TrendingDown className="w-5 h-5 text-red-600" />
    ) : (
      <Target className="w-5 h-5 text-green-600" />
    );
  };

  const getAlertColor = (type: string) => {
    return type === 'PRICE_DROP'
      ? 'bg-red-50 border-red-200'
      : 'bg-green-50 border-green-200';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE')
      return (
        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          Active
        </span>
      );
    if (status === 'RESOLVED')
      return (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          Resolved
        </span>
      );
    return (
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Portfolio Alerts</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-2">Total Alerts</p>
            <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-2">Active Alerts</p>
            <p className="text-3xl font-bold text-red-600">{activeCount}</p>
            <p className="text-sm text-gray-500 mt-2">Require action</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-2">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
            <p className="text-sm text-gray-500 mt-2">Completed</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          {['ALL', 'ACTIVE', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(status as 'ALL' | 'ACTIVE' | 'RESOLVED')
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.alert_id}
                className={`border rounded-lg p-6 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getAlertIcon(alert.type)}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{alert.message}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Ticker</p>
                          <p className="font-mono font-semibold">{alert.ticker}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-semibold">{alert.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Trigger Value</p>
                          <p className="font-semibold">{alert.trigger_value}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Value</p>
                          <p className="font-semibold">{alert.current_value}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">{getStatusBadge(alert.status)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No alerts</p>
            <p className="text-sm text-gray-500">
              {filterStatus === 'ACTIVE'
                ? 'No active alerts at this time'
                : 'Check back later for portfolio alerts'}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Disclaimer</h3>
          <p className="text-sm text-yellow-800">
            Alerts are based on real-time market data but may lag by a few minutes. This is an
            AI-based system and NOT a substitute for professional financial advice. Always verify
            price movements on official market sources before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
