import { NextResponse } from 'next/server'
import { MARKET_DATA } from '@/lib/marketData'

// Force Node.js runtime to avoid edge runtime issues
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Simple in-memory cache
const cache: { prices: Record<string, number>; timestamp: number } = {
  prices: {},
  timestamp: 0,
}

const CACHE_TTL_MS = 60_000 // 1 minute

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tickersParam = searchParams.get('tickers')
    let tickers = tickersParam
      ? tickersParam.split(',').map(t => t.trim().toUpperCase())
      : Object.keys(MARKET_DATA)

    // Filter out empty values
    tickers = tickers.filter(Boolean)
    
    const now = Date.now()
    const fresh = now - cache.timestamp < CACHE_TTL_MS

    // Return cached values if still fresh and covers requested tickers
    if (fresh) {
      const allCovered = tickers.every(t => cache.prices[t] !== undefined)
      if (allCovered) {
        return NextResponse.json({ prices: cache.prices, asOf: new Date(cache.timestamp).toISOString() })
      }
    }

    const results: Record<string, number> = { ...cache.prices }

    // Dynamic import to prevent yahoo-finance2 from being bundled with Deno test deps
    let yahooFinance: any
    try {
      yahooFinance = await import('yahoo-finance2').then(mod => mod.default)
    } catch (error) {
      // If import fails, use fallback prices only
      for (const t of tickers) {
        if (results[t] === undefined) {
          results[t] = MARKET_DATA[t]?.price || 0
        }
      }
      return NextResponse.json({ prices: results, asOf: new Date().toISOString() })
    }

    // Fetch in parallel but guard per-ticker errors
    await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const quote = await yahooFinance.quote(ticker)
          // Prefer regularMarketPrice, fallback to previousClose
          const price = quote?.regularMarketPrice ?? quote?.previousClose
          if (typeof price === 'number' && !Number.isNaN(price)) {
            results[ticker] = price
          }
        } catch (err) {
          // Ignore errors for individual tickers; fallback will be used
        }
      })
    )

    // Fill any missing prices with mock data fallback
    for (const t of tickers) {
      if (results[t] === undefined) {
        results[t] = MARKET_DATA[t]?.price || 0
      }
    }

    cache.prices = results
    cache.timestamp = Date.now()

    return NextResponse.json({ prices: results, asOf: new Date().toISOString() })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Failed to fetch quotes' }, { status: 500 })
  }
}
