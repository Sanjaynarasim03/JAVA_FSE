'use client'

import { useState } from 'react'
import { IndianRupee, Clock, ShieldCheck, ShieldAlert, Shield, Zap, Settings2, Search } from 'lucide-react'
import type { InvestmentParams } from '../types/portfolio'

interface InvestmentFormProps {
  onSubmit: (params: InvestmentParams) => void
  loading: boolean
}

const DURATIONS = [
  { months: 3, label: '3M' },
  { months: 6, label: '6M' },
  { months: 12, label: '1Y' },
  { months: 24, label: '2Y' },
  { months: 36, label: '3Y' },
  { months: 60, label: '5Y' },
] as const

const RISK_OPTIONS = [
  {
    value: 'low' as const,
    label: 'Conservative',
    desc: 'Blue-chip, low volatility',
    icon: ShieldCheck,
    color: 'text-success',
    bg: 'bg-success-muted',
    border: 'border-success/30',
  },
  {
    value: 'moderate' as const,
    label: 'Balanced',
    desc: 'Growth & stability mix',
    icon: Shield,
    color: 'text-info',
    bg: 'bg-info-muted',
    border: 'border-info/30',
  },
  {
    value: 'high' as const,
    label: 'Aggressive',
    desc: 'High growth, high volatility',
    icon: ShieldAlert,
    color: 'text-warning',
    bg: 'bg-warning-muted',
    border: 'border-warning/30',
  },
]

const MODE_OPTIONS = [
  { value: 'auto' as const, label: 'Auto', desc: '2-5 stocks' },
  { value: 'single' as const, label: 'Single', desc: '1 stock' },
  { value: 'multiple' as const, label: 'Multi', desc: '3-7 stocks' },
]

export default function InvestmentForm({ onSubmit, loading }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentParams>({
    investment_amount: 1000,
    duration_months: 12,
    risk_preference: 'moderate',
    mode: 'auto',
    preferred_tickers: [],
  })

  const [customTickers, setCustomTickers] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = {
      ...formData,
      preferred_tickers: customTickers.trim()
        ? customTickers.split(',').map((t) => t.trim().toUpperCase())
        : undefined,
    }
    onSubmit(params)
  }

  const formatAmount = (n: number) =>
    new Intl.NumberFormat('en-IN').format(n)

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Investment Parameters
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ---- Investment Amount ---- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground-secondary flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" />
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted font-mono text-sm">
              {'INR'}
            </span>
            <input
              type="number"
              min={10}
              max={5000000}
              step={10}
              value={formData.investment_amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  investment_amount: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full rounded-lg border border-border bg-background-secondary pl-12 pr-4 py-3 text-foreground font-mono text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              placeholder="50000"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-foreground-muted">
              Min ₹10 &mdash; Max ₹50,00,000
            </p>
            {formData.investment_amount >= 10 && (
              <span className="text-xs text-foreground-secondary font-mono">
                ₹{formatAmount(formData.investment_amount)}
              </span>
            )}
          </div>

          {/* Quick amount pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {[100, 200, 500, 1000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ 
                    ...prev, 
                    investment_amount: Math.min(prev.investment_amount + amt, 5000000)
                  }))
                }
                className="px-3 py-1 rounded-full text-xs font-medium transition bg-background-secondary text-foreground-secondary hover:bg-card-hover hover:text-primary"
              >
                +₹{formatAmount(amt)}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, investment_amount: 0 }))
              }
              className="px-3 py-1 rounded-full text-xs font-medium transition bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ---- Duration ---- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground-secondary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Investment Horizon
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d.months}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    duration_months: d.months as any,
                  }))
                }
                className={`py-2.5 rounded-lg text-xs font-semibold transition ${
                  formData.duration_months === d.months
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background-secondary text-foreground-secondary hover:bg-card-hover'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Risk Preference ---- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground-secondary">
            Risk Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RISK_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const isActive = formData.risk_preference === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      risk_preference: opt.value,
                    }))
                  }
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition text-center ${
                    isActive
                      ? `${opt.bg} ${opt.border} border`
                      : 'border-border bg-background-secondary hover:bg-card-hover'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? opt.color : 'text-foreground-muted'}`}
                  />
                  <span
                    className={`text-xs font-semibold ${isActive ? opt.color : 'text-foreground-secondary'}`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-foreground-muted leading-tight">
                    {opt.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ---- Selection Mode ---- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground-secondary">
            Selection Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MODE_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, mode: m.value }))
                }
                className={`py-2.5 rounded-lg border text-xs font-medium transition ${
                  formData.mode === m.value
                    ? 'bg-primary-muted border-primary/30 text-primary'
                    : 'border-border bg-background-secondary text-foreground-secondary hover:bg-card-hover'
                }`}
              >
                <span className="block font-semibold">{m.label}</span>
                <span className="text-[10px] text-foreground-muted">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- Preferred Tickers ---- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground-secondary flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Preferred Stocks
            <span className="text-foreground-muted text-xs font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={customTickers}
            onChange={(e) => setCustomTickers(e.target.value)}
            placeholder="TCS.NS, RELIANCE.NS, INFY.NS"
            className="w-full rounded-lg border border-border bg-background-secondary px-4 py-3 text-foreground text-sm font-mono placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
          <p className="text-xs text-foreground-muted">
            Comma-separated NSE tickers
          </p>
        </div>

        {/* ---- Submit ---- */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-4 rounded-lg font-semibold text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Analyzing Markets...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate Portfolio
            </>
          )}
        </button>
      </form>
    </div>
  )
}
