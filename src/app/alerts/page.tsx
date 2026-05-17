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
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--danger-muted)', color: 'var(--danger)' }}>
          Active
        </span>
      );
    if (status === 'RESOLVED')
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--success-muted)', color: 'var(--success)' }}>
          Resolved
        </span>
      );
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--info-muted)', color: 'var(--info)' }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--background)' }}>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p style={{ color: 'var(--foreground-secondary)' }}>Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>Portfolio Alerts</h1>

        {error && (
          <div className="border rounded-lg p-4 mb-8" style={{ backgroundColor: 'var(--danger-muted)', borderColor: 'var(--danger)' }}>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Total Alerts</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--info)' }}>{alerts.length}</p>
          </div>

          <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Active Alerts</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>{activeCount}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--foreground-muted)' }}>Require action</p>
          </div>

          <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>Resolved</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{resolvedCount}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--foreground-muted)' }}>Completed</p>
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
              className={`px-4 py-2 rounded-lg font-semibold transition-colors border ${
                filterStatus === status
                  ? 'border-primary'
                  : 'border-border hover:border-border-hover'
              }`}
              style={filterStatus === status ? {
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              } : {
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
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
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: alert.type === 'PRICE_DROP' ? 'var(--danger)' : 'var(--success)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getAlertIcon(alert.type)}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>{alert.message}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Ticker</p>
                          <p className="font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{alert.ticker}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Type</p>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{alert.type}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Trigger Value</p>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{alert.trigger_value}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Current Value</p>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{alert.current_value}</p>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
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
          <div className="rounded-lg p-12 text-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground-muted)' }} />
            <p className="mb-2" style={{ color: 'var(--foreground-secondary)' }}>No alerts</p>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              {filterStatus === 'ACTIVE'
                ? 'No active alerts at this time'
                : 'Check back later for portfolio alerts'}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-lg p-6 border" style={{ backgroundColor: 'var(--warning-muted)', borderColor: 'var(--warning)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--warning)' }}>⚠️ Disclaimer</h3>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            Alerts are based on real-time market data but may lag by a few minutes. This is an
            AI-based system and NOT a substitute for professional financial advice. Always verify
            price movements on official market sources before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
