import type { MarketData } from '../types/portfolio'

// Mock market data for demonstration
export const MARKET_DATA: MarketData = {
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
  }
}

export const SECTOR_ALLOCATIONS = {
  low: {
    'IT': 0.25,
    'Banking': 0.25,
    'FMCG': 0.20,
    'Pharma': 0.15,
    'Energy': 0.15
  },
  moderate: {
    'IT': 0.20,
    'Banking': 0.25,
    'Auto': 0.15,
    'FMCG': 0.15,
    'Energy': 0.10,
    'NBFC': 0.15
  },
  high: {
    'Banking': 0.15,
    'Auto': 0.20,
    'NBFC': 0.20,
    'Infrastructure': 0.25,
    'Energy': 0.20
  }
}

export const ALL_TICKERS: string[] = Object.keys(MARKET_DATA)
