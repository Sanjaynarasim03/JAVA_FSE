import type { MarketData } from '../types/portfolio'
import generatedMarketData from '../data/market-data.json'
import universeRaw from '../data/market-universe.json'

// Legacy fallback data. The generated dataset supplies the full NSE coverage.
const LEGACY_MARKET_DATA: MarketData = {
  'TCS.NS': {
    company: 'Tata Consultancy Services',
    price: 3890,
    sector: 'IT',
    marketCap: 'Large',
    pe: 28.5,
    beta: 0.8,
    dividend: 1.2,
    risk: 'Low'
  },
  'RELIANCE.NS': {
    company: 'Reliance Industries',
    price: 2850,
    sector: 'Energy',
    marketCap: 'Large',
    pe: 15.2,
    beta: 1.1,
    dividend: 0.6,
    risk: 'Moderate'
  },
  'INFY.NS': {
    company: 'Infosys Limited',
    price: 1750,
    sector: 'IT',
    marketCap: 'Large',
    pe: 25.8,
    beta: 0.9,
    dividend: 2.1,
    risk: 'Low'
  },
  'HDFCBANK.NS': {
    company: 'HDFC Bank',
    price: 1620,
    sector: 'Banking',
    marketCap: 'Large',
    pe: 18.5,
    beta: 1.0,
    dividend: 1.4,
    risk: 'Low'
  },
  'ICICIBANK.NS': {
    company: 'ICICI Bank',
    price: 1180,
    sector: 'Banking',
    marketCap: 'Large',
    pe: 16.2,
    beta: 1.2,
    dividend: 1.8,
    risk: 'Moderate'
  },
  'HINDUNILVR.NS': {
    company: 'Hindustan Unilever',
    price: 2420,
    sector: 'FMCG',
    marketCap: 'Large',
    pe: 55.2,
    beta: 0.6,
    dividend: 1.9,
    risk: 'Low'
  },
  'MARUTI.NS': {
    company: 'Maruti Suzuki India',
    price: 11500,
    sector: 'Auto',
    marketCap: 'Large',
    pe: 24.8,
    beta: 1.3,
    dividend: 1.2,
    risk: 'Moderate'
  },
  'BAJFINANCE.NS': {
    company: 'Bajaj Finance',
    price: 6800,
    sector: 'NBFC',
    marketCap: 'Large',
    pe: 28.5,
    beta: 1.6,
    dividend: 0.8,
    risk: 'High'
  },
  'SUNPHARMA.NS': {
    company: 'Sun Pharmaceutical',
    price: 1580,
    sector: 'Pharma',
    marketCap: 'Large',
    pe: 22.4,
    beta: 0.7,
    dividend: 1.1,
    risk: 'Low'
  },
  'TATAMOTORS.NS': {
    company: 'Tata Motors',
    price: 780,
    sector: 'Auto',
    marketCap: 'Large',
    pe: 12.8,
    beta: 1.8,
    dividend: 0.0,
    risk: 'High'
  },
  'ADANIPORTS.NS': {
    company: 'Adani Ports',
    price: 1250,
    sector: 'Infrastructure',
    marketCap: 'Large',
    pe: 18.5,
    beta: 1.4,
    dividend: 0.9,
    risk: 'High'
  },
  'LT.NS': {
    company: 'Larsen & Toubro',
    price: 3520,
    sector: 'Infrastructure',
    marketCap: 'Large',
    pe: 28.2,
    beta: 1.2,
    dividend: 1.8,
    risk: 'Moderate'
  },
  'ITC.NS': {
    company: 'ITC Limited',
    price: 470,
    sector: 'FMCG',
    marketCap: 'Large',
    pe: 24.5,
    beta: 0.7,
    dividend: 3.2,
    risk: 'Low'
  },
  'WIPRO.NS': {
    company: 'Wipro Limited',
    price: 560,
    sector: 'IT',
    marketCap: 'Large',
    pe: 21.8,
    beta: 0.8,
    dividend: 1.5,
    risk: 'Low'
  },
  'SBIN.NS': {
    company: 'State Bank of India',
    price: 820,
    sector: 'Banking',
    marketCap: 'Large',
    pe: 14.5,
    beta: 1.1,
    dividend: 2.0,
    risk: 'Moderate'
  },
  'BHARTIARTL.NS': {
    company: 'Bharti Airtel',
    price: 1590,
    sector: 'Telecom',
    marketCap: 'Large',
    pe: 38.2,
    beta: 0.9,
    dividend: 0.8,
    risk: 'Moderate'
  },
  'AXISBANK.NS': {
    company: 'Axis Bank',
    price: 1150,
    sector: 'Banking',
    marketCap: 'Large',
    pe: 17.8,
    beta: 1.3,
    dividend: 1.2,
    risk: 'Moderate'
  },
  'SETFNIFTY.NS': {
    company: 'Nippon India ETF Nifty 50',
    price: 230,
    sector: 'Index ETF',
    marketCap: 'Large',
    pe: 0,
    beta: 1.0,
    dividend: 1.1,
    risk: 'Low'
  },
  'TATAGOLD.NS': {
    company: 'Tata Gold Exchange Traded Fund',
    price: 13.79,
    sector: 'Commodities',
    marketCap: 'Mid',
    pe: 0,
    beta: 0.4,
    dividend: 0.0,
    risk: 'Low'
  }
}

const GENERATED_MARKET_DATA = generatedMarketData as MarketData

export interface TickerMetadata {
  ticker: string
  company: string
  sector: string
  industry: string
  marketCapValue: number | null
  isin: string | null
}

const RAW_UNIVERSE = universeRaw as TickerMetadata[]

export const MARKET_UNIVERSE: TickerMetadata[] = RAW_UNIVERSE.map((entry) => ({
  ...entry,
  ticker: entry.ticker.toUpperCase(),
  marketCapValue: entry.marketCapValue ?? null,
  isin: entry.isin ?? null
}))

export const MARKET_DATA: MarketData = {
  ...LEGACY_MARKET_DATA,
  ...GENERATED_MARKET_DATA
}

const PRIORITY_TICKERS = [
  'TECHM.NS',
  'SBIN.NS',
  'SETFNIFTY.NS',
  'TATAGOLD.NS',
  'ITC.NS',
  'BPCL.NS',
  'WIPRO.NS',
  'COFORGE.NS',
  'HDFCBANK.NS',
  'HCLTECH.NS'
]

export const TOP_LIQUID_TICKERS: string[] = MARKET_UNIVERSE
  .filter((entry) => typeof entry.marketCapValue === 'number')
  .sort((a, b) => (b.marketCapValue ?? 0) - (a.marketCapValue ?? 0))
  .slice(0, 120)
  .map((entry) => entry.ticker)

const BASE_TICKER_POOL = TOP_LIQUID_TICKERS.length > 0
  ? TOP_LIQUID_TICKERS
  : Object.keys(MARKET_DATA)

export const DEFAULT_TICKER_POOL: string[] = Array.from(new Set([
  ...PRIORITY_TICKERS,
  ...BASE_TICKER_POOL
]))

export const SECTOR_ALLOCATIONS = {
  low: {
    'Banking': 0.18,
    'Financial Services': 0.12,
    'Technology': 0.14,
    'FMCG': 0.16,
    'Healthcare': 0.12,
    'Energy & Utilities': 0.10,
    'Consumer & Media': 0.08,
    'Industrials': 0.05,
    'Metals & Mining': 0.05
  },
  moderate: {
    'Banking': 0.13,
    'Financial Services': 0.11,
    'Technology': 0.14,
    'Industrials': 0.13,
    'Automotive': 0.10,
    'FMCG': 0.09,
    'Healthcare': 0.10,
    'Energy & Utilities': 0.08,
    'Consumer & Media': 0.07,
    'Metals & Mining': 0.05
  },
  high: {
    'Banking': 0.12,
    'Financial Services': 0.10,
    'Technology': 0.13,
    'Industrials': 0.16,
    'Automotive': 0.14,
    'Energy & Utilities': 0.10,
    'Metals & Mining': 0.10,
    'Consumer & Media': 0.08,
    'Real Estate & Infrastructure': 0.07
  }
}

export const ALL_TICKERS: string[] = Object.keys(MARKET_DATA)
