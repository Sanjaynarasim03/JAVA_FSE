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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold">{ticker}</h3>
            <p className="text-gray-600">{company}</p>
          </div>
          {confidence && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Confidence</p>
              <p
                className={`text-lg font-bold ${
                  confidence === 'High'
                    ? 'text-green-600'
                    : confidence === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {confidence}
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {score !== undefined && (
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">RAMENS Score</p>
              <p className="text-2xl font-bold text-blue-600">{score.toFixed(1)}</p>
            </div>
          )}
          {allocation !== undefined && (
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Allocation</p>
              <p className="text-2xl font-bold text-green-600">{allocation.toFixed(1)}%</p>
            </div>
          )}
          {expectedReturn !== undefined && (
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Expected Return</p>
              <p className="text-2xl font-bold text-purple-600">
                {expectedReturn.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rationale */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-bold text-lg mb-3">🎯 Selection Rationale</h4>
        <p className="text-gray-700 leading-relaxed">{rationale}</p>
      </div>

      {/* Factor Breakdown */}
      {chartData.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-4">📊 Factor Contribution Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="factor" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: any) => `${(value as number).toFixed(1)}%`} />
              <Bar dataKey="contribution" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>

          {/* Factor Legend */}
          <div className="mt-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            {chartData.map((item) => (
              <div key={item.factor} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.factor}</span>
                <span className="font-semibold text-gray-900">
                  {item.contribution.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h5 className="font-bold text-blue-900 mb-2">💡 Key Insights</h5>
        <ul className="text-sm text-blue-800 space-y-1">
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
