#!/usr/bin/env node

/**
 * Fetches the NSE Nifty 500 universe and enriches it with Yahoo Finance quote data.
 * Produces a JSON dataset consumed by the portfolio generators for live coverage.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'src', 'data')
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'market-data.json')
const META_FILE = resolve(OUTPUT_DIR, 'market-universe.json')

const NSE_CSV_URL = 'https://archives.nseindia.com/content/indices/ind_nifty500list.csv'
const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/csv,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.nseindia.com/'
}

const REQUEST_PAUSE_MS = 250

function splitCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.length > 0) {
    result.push(current.trim())
  }

  return result
}

function normaliseIndustry(industryRaw) {
  const value = industryRaw?.trim() || 'Unknown'
  const map = new Map([
    ['Financial Services', 'Financials'],
    ['Fast Moving Consumer Goods', 'FMCG'],
    ['Healthcare', 'Healthcare'],
    ['Automobile and Auto Components', 'Auto'],
    ['Capital Goods', 'Industrials'],
    ['Information Technology', 'IT'],
    ['Metals & Mining', 'Metals'],
    ['Oil Gas & Consumable Fuels', 'Energy'],
    ['Power', 'Energy'],
    ['Services', 'Services'],
    ['Construction Materials', 'Materials'],
    ['Telecommunication', 'Telecom'],
    ['Consumer Durables', 'Consumer Discretionary'],
    ['Consumer Services', 'Consumer Discretionary'],
    ['Chemicals', 'Chemicals'],
    ['Construction', 'Infrastructure'],
    ['Diversified', 'Conglomerate'],
    ['Textiles', 'Textiles'],
    ['Realty', 'Real Estate'],
    ['Media Entertainment & Publication', 'Media']
  ])
  return map.get(value) || value
}

function classifyMarketCap(value) {
  if (!Number.isFinite(value) || value <= 0) return 'Mid'
  if (value >= 750_000_000_000) return 'Large'
  if (value >= 150_000_000_000) return 'Mid'
  return 'Small'
}

function classifyRisk(beta) {
  if (!Number.isFinite(beta)) return 'Moderate'
  if (beta < 0.9) return 'Low'
  if (beta <= 1.2) return 'Moderate'
  return 'High'
}

function toNumber(value, fallback = null) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

async function fetchNifty500Universe() {
  const response = await fetch(NSE_CSV_URL, { headers: NSE_HEADERS })
  if (!response.ok) {
    throw new Error(`Failed to download NSE universe: ${response.status} ${response.statusText}`)
  }

  const csvText = await response.text()
  const lines = csvText.trim().split(/\r?\n/)
  const [headerLine, ...rows] = lines
  const headers = splitCsvLine(headerLine)

  const idx = {
    company: headers.indexOf('Company Name'),
    industry: headers.indexOf('Industry'),
    symbol: headers.indexOf('Symbol'),
    series: headers.indexOf('Series'),
    isin: headers.indexOf('ISIN Code')
  }

  return rows
    .map((row) => splitCsvLine(row))
    .filter((cols) => cols.length === headers.length)
    .map((cols) => {
      const rawSymbol = cols[idx.symbol]?.trim()
      return {
        symbol: rawSymbol ? `${rawSymbol}.NS` : null,
        company: cols[idx.company]?.trim() || rawSymbol || 'Unknown',
        industry: cols[idx.industry]?.trim() || 'Unknown',
        sectorHint: normaliseIndustry(cols[idx.industry]),
        series: cols[idx.series]?.trim() || 'EQ',
        isin: cols[idx.isin]?.trim() || null
      }
    })
    .filter((row) => row.symbol)
}

async function fetchYahooQuotes(tickers) {
  const YahooFinance = (await import('yahoo-finance2')).default
  const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })
  const results = new Map()

  for (const ticker of tickers) {
    if (!ticker) continue

    try {
      const quote = await yahooFinance.quote(ticker)
      if (quote) {
        results.set((quote.symbol || ticker).toUpperCase(), quote)
      }
    } catch (error) {
      console.warn(`Failed to fetch quote for ${ticker}:`, error.message)
    }

    await new Promise(resolve => setTimeout(resolve, REQUEST_PAUSE_MS))
  }

  return results
}

function buildMarketData(universe, yahooQuotes) {
  const marketData = {}
  const metadata = []

  for (const entry of universe) {
    const ticker = entry.symbol?.toUpperCase()
    if (!ticker) continue

    const quote = yahooQuotes.get(ticker)
    const price = toNumber(quote?.regularMarketPrice ?? quote?.previousClose, null)

    if (!Number.isFinite(price) || price <= 0) {
      continue
    }

    const beta = toNumber(quote?.beta, null)
    const pe = toNumber(quote?.trailingPE ?? quote?.forwardPE, null)
    const dividendYield = toNumber(
      quote?.trailingAnnualDividendYield ?? quote?.dividendYield,
      0
    )

    const sector = quote?.sector || entry.sectorHint || 'Unknown'
    const marketCapValue = toNumber(quote?.marketCap, null)
    const risk = classifyRisk(beta ?? 1)

    marketData[ticker] = {
      company: quote?.longName || entry.company,
      price: Math.round(price * 100) / 100,
      sector,
      marketCap: classifyMarketCap(marketCapValue ?? 0),
      pe: pe && pe > 0 ? Math.round(pe * 100) / 100 : 18,
      beta: beta && beta > 0 ? Math.round(beta * 100) / 100 : 1,
      dividend: dividendYield && dividendYield > 0 ? Math.round(dividendYield * 10000) / 100 : 0,
      risk
    }

    metadata.push({
      ticker,
      company: marketData[ticker].company,
      sector,
      industry: entry.industry,
      marketCapValue: marketCapValue ?? null,
      isin: entry.isin
    })
  }

  const sortedTickers = Object.keys(marketData).sort()
  const sortedMarketData = {}
  for (const ticker of sortedTickers) {
    sortedMarketData[ticker] = marketData[ticker]
  }

  metadata.sort((a, b) => (b.marketCapValue || 0) - (a.marketCapValue || 0))

  return { marketData: sortedMarketData, metadata }
}

async function main() {
  console.log('Fetching NSE Nifty 500 universe...')
  const universe = await fetchNifty500Universe()
  console.log(`Universe size: ${universe.length}`)

  const tickers = universe.map((row) => row.symbol?.toUpperCase())
  console.log('Fetching Yahoo Finance quotes in batches...')
  const quotes = await fetchYahooQuotes(tickers)
  console.log(`Received quotes for ${quotes.size} tickers`)

  const { marketData, metadata } = buildMarketData(universe, quotes)
  console.log(`Constructed market dataset with ${Object.keys(marketData).length} entries`)

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT_FILE, JSON.stringify(marketData, null, 2), 'utf8')
  await writeFile(META_FILE, JSON.stringify(metadata, null, 2), 'utf8')

  console.log(`Saved expanded dataset to ${OUTPUT_FILE}`)
}

main().catch((error) => {
  console.error('Market data update failed:', error)
  process.exitCode = 1
})
