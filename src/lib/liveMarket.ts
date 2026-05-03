import { MARKET_DATA, ALL_TICKERS } from './marketData'

export type PriceMap = Record<string, number>

// Simple in-memory cache
const cache: { prices: PriceMap; timestamp: number } = {
  prices: {},
  timestamp: 0,
}

const CACHE_TTL_MS = 60_000 // 1 minute
const QUOTE_TIMEOUT_MS = 1_200

export function getAllTickers(): string[] {
  return ALL_TICKERS
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Quote request timed out')), timeoutMs)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

export async function fetchQuotes(tickers: string[]): Promise<PriceMap> {
  const uniqueTickers = Array.from(new Set(tickers.filter(Boolean)))
  const now = Date.now()
  const fresh = now - cache.timestamp < CACHE_TTL_MS

  // Return cached values if still fresh and covers requested tickers
  if (fresh) {
    const allCovered = uniqueTickers.every((ticker) => cache.prices[ticker] !== undefined)
    if (allCovered) return cache.prices
  }

  const results: PriceMap = { ...cache.prices }

  // Dynamic import to prevent yahoo-finance2 from being bundled with Deno test deps
  let yahooFinance: any
  try {
    const YahooFinance = (await import('yahoo-finance2')).default
    yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })
  } catch {
    // If import fails, use fallback prices only
    for (const ticker of uniqueTickers) {
      if (results[ticker] === undefined) {
        results[ticker] = MARKET_DATA[ticker]?.price || 0
      }
    }
    return results
  }

  // Fetch concurrently for lower latency
  await Promise.all(
    uniqueTickers.map(async (ticker) => {
      try {
        const quote: any = await withTimeout(yahooFinance.quote(ticker), QUOTE_TIMEOUT_MS)
        const price = quote?.regularMarketPrice ?? quote?.previousClose
        if (typeof price === 'number' && Number.isFinite(price) && price > 0) {
          results[ticker] = price
        }
      } catch {
        // Ignore errors for individual tickers; fallback will be used
      }
    })
  )

  // Fill any missing prices with mock data fallback
  for (const ticker of uniqueTickers) {
    if (results[ticker] === undefined) {
      results[ticker] = MARKET_DATA[ticker]?.price || 0
    }
  }

  cache.prices = results
  cache.timestamp = Date.now()

  return results
}
