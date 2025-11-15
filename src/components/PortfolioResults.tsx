'use client'

import type { PortfolioAllocation } from '../types/portfolio'

interface PortfolioResultsProps {
  portfolio: PortfolioAllocation
}

export default function PortfolioResults({ portfolio }: PortfolioResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Moderate': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDuration = (months: number) => {
    if (months < 12) {
      return `${months}M`
    } else if (months === 12) {
      return '1Y'
    } else if (months % 12 === 0) {
      return `${months / 12}Y`
    } else {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return `${years}Y ${remainingMonths}M`
    }
  }

  const formatDurationLong = (months: number) => {
    if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''}`
    } else if (months === 12) {
      return '1 year'
    } else if (months % 12 === 0) {
      const years = months / 12
      return `${years} year${years > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio Recommendation</h2>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(portfolio.confidence)}`}>
              {portfolio.confidence} Confidence
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              📊 AI-Generated Projection
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {formatCurrency(portfolio.investment_amount_inr)}
            </div>
            <div className="text-sm font-medium text-gray-700">Investment</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {formatCurrency(portfolio.total_expected_value_inr)}
            </div>
            <div className="text-sm font-medium text-gray-700">Expected Value</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              +{portfolio.expected_growth_pct}%
            </div>
            <div className="text-sm font-medium text-gray-700">Expected Growth</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {formatDuration(portfolio.duration_months)}
            </div>
            <div className="text-sm font-medium text-gray-700">Duration</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-800 font-medium leading-relaxed">
            <strong className="text-gray-900 font-bold">Summary:</strong> {portfolio.risk_preference.charAt(0).toUpperCase() + portfolio.risk_preference.slice(1)} risk portfolio 
            with {portfolio.allocations.length} stock{portfolio.allocations.length > 1 ? 's' : ''} targeting 
            <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded ml-1 mr-1">{portfolio.expected_growth_pct}%</span> growth over {formatDurationLong(portfolio.duration_months)}.
          </p>
          <p className="text-xs text-gray-600 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Projections: 40% historical data + 60% fundamental analysis with guaranteed minimum returns
          </p>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Stock Allocations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Allocation</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Entry Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Expected Return</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.allocations.map((allocation, index) => (
                <tr key={allocation.ticker} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{allocation.company}</div>
                      <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{allocation.ticker}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(allocation.allocation_inr)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {allocation.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(allocation.entry_price_inr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                      +{allocation.expected_return_pct}%
                    </div>
                    <div className="text-xs font-medium text-gray-700 mt-1">
                      {formatCurrency(allocation.expected_value_inr)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getRiskColor(allocation.risk)}`}>
                      {allocation.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rationales */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Rationale</h3>
        <div className="space-y-4">
          {portfolio.allocations.map((allocation) => (
            <div key={allocation.ticker} className="border-l-4 border-blue-500 pl-4">
              <div className="font-medium text-gray-900">{allocation.company} ({allocation.ticker})</div>
              <div className="text-sm text-gray-600">{allocation.rationale}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes & Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Notes & Recommendations</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-700">{portfolio.notes}</p>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
          <h4 className="font-medium text-blue-800 mb-2">📊 Methodology:</h4>
          <p className="text-sm text-blue-700 mb-2">
            This portfolio is generated using a multi-factor scoring algorithm that analyzes:
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li><strong>Fundamental Analysis:</strong> PE ratios, dividend yields, market capitalization</li>
            <li><strong>Risk Metrics:</strong> Beta (volatility), sector diversification</li>
            <li><strong>Momentum Indicators:</strong> Recent price trends and sector performance</li>
            <li><strong>Duration Adjustment:</strong> Returns compounded for your investment horizon</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Risk Factors:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Market Volatility:</strong> Stock prices can fluctuate significantly in the short term</li>
            <li>• <strong>Economic Factors:</strong> Interest rates, inflation, and GDP growth affect returns</li>
            <li>• <strong>Company-Specific Risks:</strong> Individual stocks may underperform due to business challenges</li>
            <li>• <strong>Projections vs Reality:</strong> Expected returns are estimates; actual returns may vary significantly</li>
            <li>• <strong>Diversification:</strong> {portfolio.allocations.length < 4 && 'Consider adding more stocks for better risk management'}</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Next Steps:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Due Diligence:</strong> Research each recommended company independently</li>
            <li>• <strong>Stop Loss:</strong> Consider setting stop-loss at 10-15% below entry price</li>
            <li>• <strong>Monitor Quarterly:</strong> Review earnings reports and sector performance</li>
            <li>• <strong>Rebalance:</strong> Review portfolio allocation {portfolio.duration_months >= 24 ? 'every 6 months' : 'quarterly'}</li>
            <li>• <strong>Professional Advice:</strong> Consult a SEBI-registered advisor before investing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
