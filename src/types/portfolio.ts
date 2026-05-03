export interface InvestmentParams {
  investment_amount: number
  duration_months: 3 | 6 | 12 | 24 | 36 | 60
  risk_preference: 'low' | 'moderate' | 'high'
  mode: 'auto' | 'single' | 'multiple'
  preferred_tickers?: string[]
}

export interface StockAllocation {
  rank: number
  company: string
  ticker: string
  allocation_inr: number
  shares: number
  entry_price_inr: number
  expected_return_pct: number
  expected_value_inr: number
  risk: 'Low' | 'Moderate' | 'High'
  rationale: string
  score?: number
  factor_breakdown?: Record<string, number>
}

export interface PortfolioAllocation {
  investment_amount_inr: number
  duration_months: number
  risk_preference: 'low' | 'moderate' | 'high'
  risk_level?: 'Low' | 'Moderate' | 'High'
  mode?: 'auto' | 'single' | 'multiple'
  allocations: StockAllocation[]
  total_expected_value_inr: number
  unallocated_cash_inr?: number
  expected_growth_pct: number
  confidence: 'Low' | 'Medium' | 'High'
  notes: string
  portfolio_summary?: string
  methodology?: string
  generated_at?: string
  ai_generated?: boolean
}

export interface MarketData {
  [ticker: string]: {
    company: string
    price: number
    sector: string
    marketCap: string
    pe: number
    beta: number
    dividend: number
    risk: 'Low' | 'Moderate' | 'High'
  }
}

export interface PortfolioHistoryEntry {
  email: string
  risk: string
  investment: number
  stocks: Array<Record<string, unknown>>
  expectedReturn: number
  date: string
}
