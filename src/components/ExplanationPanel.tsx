'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FactorBreakdown {
  [key: string]: number;
}

interface ExplanationPanelProps {
  ticker: string;
  company: string;
  rationale: string;
  factorBreakdown?: FactorBreakdown;
  score?: number;
  confidence?: string;
  allocation?: number;
  expectedReturn?: number;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  ticker,
  company,
  rationale,
  factorBreakdown,
  score,
  confidence,
  allocation,
  expectedReturn,
}) => {
  const chartData = factorBreakdown
    ? Object.entries(factorBreakdown).map(([key, value]) => ({
        factor: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        contribution: value,
      }))
    : [];

  return (
    <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{ticker}</h3>
            <p style={{ color: 'var(--foreground-secondary)' }}>{company}</p>
          </div>
          {confidence && (
            <div className="text-right">
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Confidence</p>
              <p
                className="text-lg font-bold"
                style={{
                  color: confidence === 'High'
                    ? 'var(--success)'
                    : confidence === 'Medium'
                      ? 'var(--warning)'
                      : 'var(--danger)'
                }}
              >
                {confidence}
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {score !== undefined && (
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>RAMENS Score</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>{score.toFixed(1)}</p>
            </div>
          )}
          {allocation !== undefined && (
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Allocation</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{allocation.toFixed(1)}%</p>
            </div>
          )}
          {expectedReturn !== undefined && (
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Expected Return</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {expectedReturn.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rationale */}
      <div className="mb-6 pb-6" style={{ borderColor: 'var(--border)', borderBottomWidth: '1px' }}>
        <h4 className="font-bold text-lg mb-3" style={{ color: 'var(--foreground)' }}>🎯 Selection Rationale</h4>
        <p className="leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>{rationale}</p>
      </div>

      {/* Factor Breakdown */}
      {chartData.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>📊 Factor Contribution Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="factor" angle={-45} textAnchor="end" height={100} stroke="var(--foreground-secondary)" />
              <YAxis stroke="var(--foreground-secondary)" />
              <Tooltip formatter={(value: any) => `${(value as number).toFixed(1)}%`} />
              <Bar dataKey="contribution" fill="var(--info)" />
            </BarChart>
          </ResponsiveContainer>

          {/* Factor Legend */}
          <div className="mt-6 grid grid-cols-2 gap-4 p-4 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
            {chartData.map((item) => (
              <div key={item.factor} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>{item.factor}</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  {item.contribution.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-6 rounded p-4 border" style={{ backgroundColor: 'var(--info-muted)', borderColor: 'var(--info)' }}>
        <h5 className="font-bold mb-2" style={{ color: 'var(--info)' }}>💡 Key Insights</h5>
        <ul className="text-sm space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
          <li>
            • This stock was selected by the RAMENS algorithm for multi-factor alignment
          </li>
          <li>• Factors include momentum, fundamentals, beta, blend, and macro outlook</li>
          <li>
            • Allocation size reflects the stock's risk-adjusted expected contribution
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExplanationPanel;
