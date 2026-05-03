'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, CalendarDays, ShieldCheck, TrendingUp } from 'lucide-react'
import Header from '../../components/Header'
import { apiRequest } from '../../lib/backend'
import { PortfolioHistoryEntry } from '../../types/portfolio'
import { readAuthSession } from '../../lib/auth'

interface MeResponse {
  email: string
  name: string
}

interface HistoryResponse {
  count: number
  items: PortfolioHistoryEntry[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<MeResponse | null>(null)
  const [history, setHistory] = useState<PortfolioHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = readAuthSession()
    if (!session) {
      router.replace('/login')
      return
    }

    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [profileResponse, historyResponse] = await Promise.all([
          apiRequest<MeResponse>('/me'),
          apiRequest<HistoryResponse>(`/get-portfolios?email=${encodeURIComponent(session.email)}`),
        ])

        setProfile(profileResponse)
        setHistory(historyResponse.items)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [router])

  const latestPortfolio = history.at(-1)
  const totalInvested = useMemo(
    () => history.reduce((sum, item) => sum + item.investment, 0),
    [history],
  )

  const latestStocks = latestPortfolio?.stocks ?? []

  return (
    <div className="min-h-screen">
      <Header section="dashboard" usingLiveData={!!profile} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl shadow-black/15">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Dashboard</p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {profile ? `Welcome, ${profile.name}` : 'Loading your workspace'}
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-secondary">
              Your portfolios are protected by JWT, stored in CSV, and summarized by the RAMENS engine. Use the generator to create another allocation or review your history below.
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Saved portfolios</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{loading ? '...' : history.length}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Capital deployed</p>
                <p className="mt-2 text-3xl font-bold text-foreground">₹{loading ? '...' : totalInvested.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Latest risk</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{latestPortfolio?.risk ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl shadow-black/15">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Quick actions</p>
                <h2 className="text-xl font-bold text-foreground">Continue the workflow</h2>
              </div>
              <div className="rounded-2xl bg-success-muted p-3 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <Link href="/generator" className="flex items-center justify-between rounded-3xl border border-border bg-background-secondary/80 p-4 transition hover:bg-card-hover">
              <div>
                <p className="font-semibold text-foreground">Generate a portfolio</p>
                <p className="mt-1 text-sm text-foreground-secondary">Run RAMENS on your current profile.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </Link>

            <Link href="/history" className="flex items-center justify-between rounded-3xl border border-border bg-background-secondary/80 p-4 transition hover:bg-card-hover">
              <div>
                <p className="font-semibold text-foreground">Portfolio history</p>
                <p className="mt-1 text-sm text-foreground-secondary">Review allocations, returns, and risk labels.</p>
              </div>
              <CalendarDays className="h-5 w-5 text-primary" />
            </Link>

            <div className="rounded-3xl border border-warning/20 bg-warning-muted p-4 text-sm text-foreground-secondary">
              <p className="font-semibold text-warning">Methodology reminder</p>
              <p className="mt-2 leading-6">
                RAMENS ranks stocks with momentum, fundamentals, inverse beta, factor blend, and macro bias. It is a simulation and not financial advice.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-border bg-card/95 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Portfolio trend</p>
            <h3 className="mt-2 text-xl font-bold text-foreground">AI Generated</h3>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">Your allocation history is written locally to data/portfolios.csv each time a portfolio is generated.</p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card/95 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Security</p>
            <h3 className="mt-2 text-xl font-bold text-foreground">Protected APIs</h3>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">JWT verification is enforced on generate, save, and history endpoints.</p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card/95 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Status</p>
            <h3 className="mt-2 text-xl font-bold text-foreground">Offline friendly</h3>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">The system works without cloud storage and can run locally on your machine.</p>
          </div>
        </section>

        {latestPortfolio ? (
          <section className="rounded-[2rem] border border-border bg-card/95 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-foreground-muted">Latest portfolio</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">Expected return {latestPortfolio.expectedReturn}%</h2>
              </div>
              <div className="rounded-2xl bg-primary-muted px-4 py-2 text-sm font-semibold text-primary">
                {latestPortfolio.risk} risk
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {latestStocks.slice(0, 4).map((stock) => (
                <div key={String(stock.ticker ?? stock.company)} className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                  <p className="text-sm font-semibold text-foreground">{String(stock.company ?? stock.ticker)}</p>
                  <p className="mt-1 text-xs text-foreground-muted">{String(stock.ticker ?? 'N/A')}</p>
                  <p className="mt-4 text-lg font-bold text-primary">₹{Number(stock.allocation_inr ?? 0).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
