'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, BadgeCheck, Shield } from 'lucide-react'
import Header from '../../components/Header'
import InvestmentForm from '../../components/InvestmentForm'
import PortfolioResults from '../../components/PortfolioResults'
import { apiRequest } from '../../lib/backend'
import { readAuthSession } from '../../lib/auth'
import type { InvestmentParams, PortfolioAllocation } from '../../types/portfolio'

export default function GeneratorPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<PortfolioAllocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!readAuthSession()) {
      router.replace('/login')
    }
  }, [router])

  const handleGeneratePortfolio = async (params: InvestmentParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest<PortfolioAllocation>('/generate-portfolio', {
        method: 'POST',
        body: JSON.stringify({
          investment_amount: params.investment_amount,
          duration_months: params.duration_months,
          risk_preference: params.risk_preference,
          mode: params.mode,
          preferred_tickers: params.preferred_tickers,
        }),
      })

      setPortfolio({
        ...response,
        allocations: response.allocations.map((allocation) => ({
          ...allocation,
          rationale: allocation.rationale ?? '',
          factor_breakdown: allocation.factor_breakdown,
          score: allocation.score,
        })),
      })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate portfolio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header section="generator" usingLiveData />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-success">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  AI Generated
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Generate your RAMENS portfolio</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                  Choose your capital, duration, and risk preference. INTELLiINVEST will score the eligible universe, rank the results, and store the allocation in CSV.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground-secondary">
                <div className="flex items-center gap-2 text-warning">
                  <Shield className="h-4 w-4" />
                  <span className="font-semibold">Risk note</span>
                </div>
                <p className="mt-2 max-w-sm leading-6">
                  This is a simulation and not financial advice. Review the rationale and methodology before acting on any result.
                </p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <div className="lg:sticky lg:top-6 h-fit">
              <InvestmentForm onSubmit={handleGeneratePortfolio} loading={loading} />
            </div>

            <div className="min-w-0">
              {loading ? (
                <div className="rounded-[2rem] border border-border bg-card p-12 text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  <p className="text-sm text-foreground-secondary">Analyzing factors, normalizing scores, and generating portfolio output...</p>
                </div>
              ) : portfolio ? (
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-border bg-card/95 p-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Risk level</p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{portfolio.risk_level ?? 'Moderate'}</p>
                      </div>
                      <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Methodology</p>
                        <p className="mt-2 text-sm leading-6 text-foreground-secondary">{portfolio.methodology ?? 'RAMENS multi-factor scoring'}</p>
                      </div>
                      <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">AI generated</p>
                        <p className="mt-2 text-2xl font-bold text-success">Yes</p>
                      </div>
                    </div>
                  </div>

                  <PortfolioResults portfolio={portfolio} />

                  <div className="rounded-[2rem] border border-warning/20 bg-warning-muted p-5 text-sm leading-6 text-foreground-secondary">
                    <p className="font-semibold text-warning">Methodology and warning</p>
                    <p className="mt-2">
                      RAMENS scores momentum, fundamentals, inverse beta, factor blend, and macro context, then normalizes the result before ranking. All outputs are deterministic simulations and not financial advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-border bg-card p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-muted text-primary">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Ready when you are</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">
                    Generate a portfolio to see ranked allocations, expected returns, risk indicators, and a saved CSV record.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
