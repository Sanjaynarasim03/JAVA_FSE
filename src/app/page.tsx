'use client'

import { useState } from 'react'
import Header from '../components/Header'
import InvestmentForm from '../components/InvestmentForm'
import PortfolioResults from '../components/PortfolioResults'
import { BarChart3, AlertTriangle } from 'lucide-react'
import type { InvestmentParams, PortfolioAllocation } from '../types/portfolio'

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioAllocation | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGeneratePortfolio = async (params: InvestmentParams) => {
    setLoading(true)
    try {
      const response = await fetch('/api/advanced-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investment_amount_inr: params.investment_amount,
          duration_months: params.duration_months,
          risk_preference: params.risk_preference,
          mode: params.mode,
          preferred_tickers: params.preferred_tickers,
        }),
      })

      const apiResult = await response.json()

      if (!response.ok || apiResult.status !== 'ok') {
        throw new Error(apiResult?.message || 'Failed to generate portfolio')
      }

      const mappedResult: PortfolioAllocation = {
        investment_amount_inr: apiResult.investment_amount_inr,
        duration_months: apiResult.duration_months,
        risk_preference: apiResult.risk_preference,
        allocations: apiResult.allocations.map((allocation: any) => ({
          rank: Number.isFinite(allocation.rank) ? allocation.rank : 0,
          company: allocation.company,
          ticker: allocation.ticker,
          allocation_inr: Number.isFinite(allocation.allocation_inr) ? allocation.allocation_inr : 0,
          shares: Number.isFinite(allocation.shares) ? allocation.shares : 0,
          entry_price_inr: Number.isFinite(allocation.entry_price_inr) ? allocation.entry_price_inr : 0,
          expected_return_pct: Number.isFinite(allocation.predicted_return_pct) ? allocation.predicted_return_pct : 0,
          expected_value_inr: Number.isFinite(allocation.predicted_value_inr) ? allocation.predicted_value_inr : 0,
          risk: allocation.risk_level,
          rationale: allocation.rationale_short,
        })),
        total_expected_value_inr: apiResult.total_expected_value_inr,
        unallocated_cash_inr: Number.isFinite(apiResult.unallocated_cash_inr) ? apiResult.unallocated_cash_inr : 0,
        expected_growth_pct: apiResult.expected_growth_pct,
        confidence: apiResult.model_metadata?.model_confidence_score ?? 'Medium',
        notes: apiResult.notes,
      }

      setPortfolio(mappedResult)
    } catch (error) {
      console.error('Error generating portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header usingLiveData={false} />

      {/* Hero bar */}
      <section className="border-b border-border bg-background-secondary">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <h2 className="text-balance text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            AI-Powered Portfolio Engine
          </h2>
          <p className="mt-2 text-sm sm:text-base text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            Real-time NSE data, risk-adjusted projections, and algorithmic stock selection for the Indian market.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-8">
            {/* Left sidebar - form */}
            <div className="lg:sticky lg:top-6 h-fit">
              <InvestmentForm
                onSubmit={handleGeneratePortfolio}
                loading={loading}
              />
            </div>

            {/* Right - results */}
            <div className="min-w-0">
              {loading ? (
                <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary mb-4" />
                  <p className="text-sm text-foreground-secondary">
                    Analyzing market data and generating your portfolio...
                  </p>
                </div>
              ) : portfolio ? (
                <PortfolioResults portfolio={portfolio} />
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-muted flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Ready to Build Your Portfolio
                  </h3>
                  <p className="text-sm text-foreground-secondary max-w-sm">
                    Configure your investment parameters on the left and hit
                    Generate to get AI-powered stock recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Disclaimer footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="rounded-lg border border-warning/20 bg-warning-muted p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-warning mb-1">
                  Investment Risk Disclaimer
                </p>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  This is an AI-based simulation tool for educational purposes
                  only. It is NOT financial advice, investment recommendation, or
                  a solicitation to buy/sell securities. Projections are
                  algorithmic estimates based on historical patterns &mdash; past
                  performance does not guarantee future results. Not SEBI
                  registered. Always consult a qualified, registered financial
                  advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-foreground-muted">
              INTELLiINVEST &middot; AI-Powered Portfolio Engine
            </p>
            <p className="text-xs text-foreground-muted font-mono">
              NSE / BSE &middot; India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
