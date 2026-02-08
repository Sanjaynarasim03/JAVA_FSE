'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ArrowUpRight, Clock, ShieldCheck, Briefcase, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { PortfolioAllocation } from '../types/portfolio'

interface PortfolioResultsProps {
  portfolio: PortfolioAllocation
}

const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316']

export default function PortfolioResults({ portfolio }: PortfolioResultsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  const formatDuration = (months: number) => {
    if (months < 12) return `${months}M`
    if (months === 12) return '1Y'
    if (months % 12 === 0) return `${months / 12}Y`
    const y = Math.floor(months / 12)
    const m = months % 12
    return `${y}Y ${m}M`
  }

  const formatDurationLong = (months: number) => {
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
    if (months === 12) return '1 year'
    if (months % 12 === 0) {
      const y = months / 12
      return `${y} year${y > 1 ? 's' : ''}`
    }
    const y = Math.floor(months / 12)
    const m = months % 12
    return `${y}Y ${m}M`
  }

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-success bg-success-muted'
      case 'Moderate':
        return 'text-warning bg-warning-muted'
      case 'High':
        return 'text-danger bg-danger-muted'
      default:
        return 'text-foreground-muted bg-surface'
    }
  }

  const getConfidenceStyle = (c: string) => {
    switch (c) {
      case 'High':
        return 'text-success bg-success-muted'
      case 'Medium':
        return 'text-warning bg-warning-muted'
      case 'Low':
        return 'text-danger bg-danger-muted'
      default:
        return 'text-foreground-muted bg-surface'
    }
  }

  const totalInvested = portfolio.allocations.reduce((s, a) => s + a.allocation_inr, 0)
  const profitAmount = portfolio.total_expected_value_inr - totalInvested

  /* Pie chart data */
  const pieData = portfolio.allocations.map((a) => ({
    name: a.ticker.replace('.NS', ''),
    value: a.allocation_inr,
  }))

  /* Bar chart data */
  const barData = portfolio.allocations.map((a) => ({
    name: a.ticker.replace('.NS', ''),
    return: a.expected_return_pct,
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Summary metrics ---- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Portfolio Recommendation</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceStyle(portfolio.confidence)}`}>
            {portfolio.confidence} Confidence
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Invested */}
          <div className="rounded-lg bg-background-secondary border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Invested</p>
            <p className="text-xl font-bold text-foreground font-mono">
              {formatCurrency(portfolio.investment_amount_inr)}
            </p>
          </div>
          {/* Expected Value */}
          <div className="rounded-lg bg-success-muted border border-success/20 p-4">
            <p className="text-xs text-success mb-1">Expected Value</p>
            <p className="text-xl font-bold text-success font-mono">
              {formatCurrency(portfolio.total_expected_value_inr)}
            </p>
          </div>
          {/* Growth */}
          <div className="rounded-lg bg-background-secondary border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Expected Growth</p>
            <p className="text-xl font-bold text-primary font-mono flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +{portfolio.expected_growth_pct}%
            </p>
          </div>
          {/* Duration */}
          <div className="rounded-lg bg-background-secondary border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Duration</p>
            <p className="text-xl font-bold text-foreground font-mono flex items-center gap-1">
              <Clock className="w-4 h-4 text-foreground-muted" />
              {formatDuration(portfolio.duration_months)}
            </p>
          </div>
        </div>

        {/* Profit bar */}
        <div className="mt-4 rounded-lg bg-background-secondary border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground-muted">
              {portfolio.risk_preference.charAt(0).toUpperCase() + portfolio.risk_preference.slice(1)} risk
              &middot; {portfolio.allocations.length} stock{portfolio.allocations.length > 1 ? 's' : ''}
              &middot; {formatDurationLong(portfolio.duration_months)}
            </span>
            <span className="text-xs font-semibold text-success font-mono">
              +{formatCurrency(profitAmount)} projected
            </span>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${Math.min((totalInvested / portfolio.total_expected_value_inr) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-foreground-muted">Invested</span>
            <span className="text-[10px] text-foreground-muted">Target</span>
          </div>
        </div>
      </div>

      {/* ---- Charts row ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allocation Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Allocation Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#141C2F',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-xs text-foreground-secondary">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Returns Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Expected Returns (%)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Return']}
                contentStyle={{
                  backgroundColor: '#141C2F',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Stock Allocation Cards ---- */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Stock Allocations</h3>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Allocation</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Entry Price</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Exp. Return</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {portfolio.allocations.map((a, idx) => (
                <tr key={a.ticker} className="hover:bg-card-hover transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      >
                        {a.ticker.replace('.NS', '').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.company}</p>
                        <p className="text-xs text-foreground-muted font-mono">{a.ticker}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-foreground font-mono">{formatCurrency(a.allocation_inr)}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-foreground font-mono">
                    {a.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-foreground font-mono">
                    {formatCurrency(a.entry_price_inr)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-success font-mono">+{a.expected_return_pct}%</span>
                      <span className="text-[11px] text-foreground-muted font-mono">{formatCurrency(a.expected_value_inr)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${getRiskStyle(a.risk)}`}>
                      {a.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {portfolio.allocations.map((a, idx) => (
            <div key={a.ticker} className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  >
                    {a.ticker.replace('.NS', '').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.company}</p>
                    <p className="text-xs text-foreground-muted font-mono">{a.ticker}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getRiskStyle(a.risk)}`}>
                  {a.risk}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-foreground-muted">Allocation</p>
                  <p className="text-xs font-semibold text-foreground font-mono">{formatCurrency(a.allocation_inr)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-foreground-muted">Entry</p>
                  <p className="text-xs font-semibold text-foreground font-mono">{formatCurrency(a.entry_price_inr)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-foreground-muted">Return</p>
                  <p className="text-xs font-bold text-success font-mono">+{a.expected_return_pct}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Rationale ---- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-info" />
          <h3 className="text-sm font-semibold text-foreground">Investment Rationale</h3>
        </div>
        <div className="flex flex-col gap-3">
          {portfolio.allocations.map((a, idx) => (
            <div
              key={a.ticker}
              className="flex gap-3 p-3 rounded-lg bg-background-secondary border border-border"
            >
              <div
                className="w-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {a.company}{' '}
                  <span className="text-foreground-muted font-mono text-xs">({a.ticker})</span>
                </p>
                <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">{a.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Notes & Disclaimer ---- */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Portfolio Notes</h3>
          <p className="text-sm text-foreground-secondary leading-relaxed rounded-lg bg-background-secondary border border-border p-3">
            {portfolio.notes}
          </p>
        </div>

        {/* Risk Factors */}
        <div className="rounded-lg border border-warning/20 bg-warning-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h4 className="text-xs font-semibold text-warning">Risk Factors</h4>
          </div>
          <ul className="flex flex-col gap-1 text-xs text-foreground-secondary">
            <li><strong className="text-foreground">Market Volatility:</strong> Stock prices can fluctuate significantly</li>
            <li><strong className="text-foreground">Economic Factors:</strong> Interest rates, inflation affect returns</li>
            <li><strong className="text-foreground">Projections vs Reality:</strong> Expected returns are estimates only</li>
            <li><strong className="text-foreground">Not SEBI Registered:</strong> This tool is not registered with any regulatory authority</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border border-success/20 bg-success-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <h4 className="text-xs font-semibold text-success">Next Steps</h4>
          </div>
          <ul className="flex flex-col gap-1 text-xs text-foreground-secondary">
            <li><strong className="text-foreground">Due Diligence:</strong> Research each recommended company independently</li>
            <li><strong className="text-foreground">Stop Loss:</strong> Consider setting stop-loss at 10-15% below entry price</li>
            <li><strong className="text-foreground">Monitor:</strong> Review earnings reports and sector performance quarterly</li>
            <li><strong className="text-foreground">Rebalance:</strong> Review allocation {portfolio.duration_months >= 24 ? 'every 6 months' : 'quarterly'}</li>
            <li><strong className="text-foreground">Professional Advice:</strong> Consult a SEBI-registered advisor before investing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
