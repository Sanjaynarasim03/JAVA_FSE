'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Header from '@/components/Header';
import { TrendingUp, CheckCircle } from 'lucide-react';

interface ModelResult {
  model: string;
  formula: string;
  expected_return?: number;
  portfolio_return?: number;
  portfolio_volatility?: number;
  beta?: number;
  sharpe_ratio?: number;
  allocations?: number;
  confidence?: string;
  pros: string[];
  cons: string[];
}

interface ComparisonData {
  capm: ModelResult;
  markowitz: ModelResult;
  ramens: ModelResult;
  recommendation?: {
    best_for_return: string;
    best_for_risk_adjusted: string;
    overall_recommendation: string;
    reasoning: string[];
  };
  metrics_comparison?: {
    capm_return: number;
    markowitz_return: number;
    ramens_return: number;
    markowitz_volatility: number;
    ramens_volatility: number;
    markowitz_sharpe: number;
    ramens_sharpe: number;
  };
}

export default function ModelComparison() {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      // Sample allocations and data
      const allocations = [
        { ticker: 'TCS.NS', allocation_pct: 25 },
        { ticker: 'INFY.NS', allocation_pct: 25 },
        { ticker: 'RELIANCE.NS', allocation_pct: 25 },
        { ticker: 'HDFC.NS', allocation_pct: 25 },
      ];

      const res = await fetch('http://localhost:8000/compare-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          allocations,
          expected_return: 14.5,
          volatility: 18.2,
        }),
      });

      if (!res.ok) throw new Error('Failed to compare models');

      const data = await res.json();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare models');
    } finally {
      setLoading(false);
    }
  };

  const chartData = comparison?.metrics_comparison
    ? [
        {
          name: 'Expected Return (%)',
          CAPM: comparison.metrics_comparison.capm_return,
          Markowitz: comparison.metrics_comparison.markowitz_return,
          RAMENS: comparison.metrics_comparison.ramens_return,
        },
        {
          name: 'Volatility (%)',
          CAPM: 0,
          Markowitz: comparison.metrics_comparison.markowitz_volatility,
          RAMENS: comparison.metrics_comparison.ramens_volatility,
        },
        {
          name: 'Sharpe Ratio',
          CAPM: 0,
          Markowitz: comparison.metrics_comparison.markowitz_sharpe,
          RAMENS: comparison.metrics_comparison.ramens_sharpe,
        },
      ]
    : [];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Model Comparison</h1>
        <p className="mb-8" style={{ color: 'var(--foreground-secondary)' }}>
          Compare CAPM, Markowitz, and RAMENS portfolio optimization approaches
        </p>

        {error && (
          <div className="border rounded-lg p-4 mb-8" style={{ backgroundColor: 'var(--danger-muted)', borderColor: 'var(--danger)' }}>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleCompare}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold mb-8 border transition-colors"
          style={!loading ? {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderColor: 'var(--primary)',
          } : {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderColor: 'var(--primary)',
            opacity: 0.5,
          }}
        >
          {loading ? 'Comparing...' : 'Compare Models'}
        </button>

        {comparison && (
          <>
            {/* Recommendation */}
            {comparison.recommendation && (
              <div className="border rounded-lg p-8 mb-12" style={{ backgroundColor: 'var(--primary-muted)', borderColor: 'var(--primary)' }}>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: 'var(--primary)' }} />
                  <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                      Recommendation: {comparison.recommendation.overall_recommendation}
                    </h2>
                    <ul className="space-y-2">
                      {comparison.recommendation.reasoning.map((reason, i) => (
                        <li key={i} className="flex gap-2" style={{ color: 'var(--foreground)' }}>
                          <span style={{ color: 'var(--primary)' }}>✓</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics Comparison Chart */}
            {chartData.length > 0 && (
              <div className="rounded-lg p-6 mb-12 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Metrics Comparison</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--foreground-secondary)" />
                    <YAxis stroke="var(--foreground-secondary)" />
                    <Tooltip />
                    <Legend />
                    {Object.keys(chartData[0])
                      .filter((k) => k !== 'name')
                      .map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={
                            key === 'CAPM'
                              ? 'var(--danger)'
                              : key === 'Markowitz'
                                ? 'var(--warning)'
                                : 'var(--success)'
                          }
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Model Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[comparison.capm, comparison.markowitz, comparison.ramens].map(
                (model) => (
                  <div
                    key={model.model}
                    className="border-2 rounded-lg p-6"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: model.model === 'RAMENS' ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>{model.model}</h3>

                    <div className="mb-6 space-y-2">
                      {model.expected_return !== undefined && (
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Expected Return</p>
                          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                            {model.expected_return.toFixed(2)}%
                          </p>
                        </div>
                      )}
                      {model.portfolio_return !== undefined && (
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Portfolio Return</p>
                          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                            {model.portfolio_return.toFixed(2)}%
                          </p>
                        </div>
                      )}
                      {model.portfolio_volatility !== undefined && (
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Volatility</p>
                          <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                            {model.portfolio_volatility.toFixed(2)}%
                          </p>
                        </div>
                      )}
                      {model.sharpe_ratio !== undefined && (
                        <div>
                          <p style={{ color: 'var(--foreground-secondary)' }}>Sharpe Ratio</p>
                          <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
                            {model.sharpe_ratio.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold mb-2" style={{ color: 'var(--success)' }}>Pros:</p>
                      <ul className="text-sm space-y-1">
                        {model.pros.map((pro, i) => (
                          <li key={i} style={{ color: 'var(--success)' }}>
                            ✓ {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold mb-2" style={{ color: 'var(--danger)' }}>Cons:</p>
                      <ul className="text-sm space-y-1">
                        {model.cons.map((con, i) => (
                          <li key={i} style={{ color: 'var(--danger)' }}>
                            ✗ {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Formula Section */}
            <div className="rounded-lg p-8 mb-12 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Model Formulas</h2>
              <div className="space-y-4">
                {[comparison.capm, comparison.markowitz, comparison.ramens].map(
                  (model) => (
                    <div key={model.model} className="p-4 rounded border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{model.model}</p>
                      <code className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                        {model.formula}
                      </code>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--warning-muted)', borderColor: 'var(--warning)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--warning)' }}>⚠️ Disclaimer</h3>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            This comparison is for educational purposes only. RAMENS is recommended for its
            explainability and multi-factor approach, but all models have limitations. Past
            performance is not indicative of future results. Consult a financial advisor before
            making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
