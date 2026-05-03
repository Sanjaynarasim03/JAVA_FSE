'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock3, Layers3, ShieldCheck } from 'lucide-react'
import Header from '../../components/Header'
import { apiRequest } from '../../lib/backend'
import { PortfolioHistoryEntry } from '../../types/portfolio'
import { readAuthSession } from '../../lib/auth'

interface HistoryResponse {
  count: number
  items: PortfolioHistoryEntry[]
}

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<PortfolioHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = readAuthSession()
    if (!session) {
      router.replace('/login')
      return
    }

    const loadHistory = async () => {
      try {
        setLoading(true)
        const response = await apiRequest<HistoryResponse>(`/get-portfolios?email=${encodeURIComponent(session.email)}`)
        setItems(response.items)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load history')
      } finally {
        setLoading(false)
      }
    }

    void loadHistory()
  }, [router])

  const totalInvested = useMemo(() => items.reduce((sum, item) => sum + item.investment, 0), [items])

  return (
    <div className="min-h-screen">
      <Header section="history" usingLiveData />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl shadow-black/15">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Layers3 className="h-3.5 w-3.5" />
                Portfolio history
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">CSV-backed portfolio ledger</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
                Every generated portfolio is stored locally and rendered here with the risk label, capital, expected return, and stock list.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground-secondary">
              <div className="flex items-center gap-2 text-success">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">JWT protected</span>
              </div>
              <p className="mt-2">Only your authenticated email can fetch its matching history.</p>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Entries</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{loading ? '...' : items.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Capital seen</p>
              <p className="mt-2 text-3xl font-bold text-foreground">₹{loading ? '...' : totalInvested.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background-secondary/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Ledger type</p>
              <p className="mt-2 text-3xl font-bold text-foreground">Local CSV</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm text-foreground-secondary">Loading saved portfolios...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.slice().reverse().map((item) => {
              const topStocks = item.stocks.slice(0, 3)
              return (
                <article key={`${item.date}-${item.investment}`} className="rounded-[2rem] border border-border bg-card/95 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        <Clock3 className="h-3 w-3" />
                        {new Date(item.date).toLocaleString()}
                      </div>
                      <h2 className="mt-3 text-2xl font-bold text-foreground">₹{item.investment.toLocaleString('en-IN')} portfolio</h2>
                      <p className="mt-2 text-sm text-foreground-secondary">Risk {item.risk} · Expected return {item.expectedReturn}%</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-background-secondary px-4 py-3 text-sm text-foreground-secondary">
                      Saved for {item.email}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {topStocks.map((stock) => (
                      <div key={`${String(stock.ticker ?? stock.company)}-${String(stock.rank ?? stock.allocation_inr)}`} className="rounded-3xl border border-border bg-background-secondary/80 p-4">
                        <p className="text-sm font-semibold text-foreground">{String(stock.company ?? stock.ticker)}</p>
                        <p className="mt-1 text-xs text-foreground-muted">{String(stock.ticker ?? 'N/A')}</p>
                        <p className="mt-4 text-lg font-bold text-primary">₹{Number(stock.allocation_inr ?? 0).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border bg-card p-12 text-center">
            <p className="text-xl font-bold text-foreground">No saved portfolios yet.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-foreground-secondary">
              Generate your first RAMENS portfolio from the generator page and it will appear here automatically.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
