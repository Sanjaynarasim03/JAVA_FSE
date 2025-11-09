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
}

export interface PortfolioAllocation {
  investment_amount_inr: number
  duration_months: number
  risk_preference: 'low' | 'moderate' | 'high'
  allocations: StockAllocation[]
  total_expected_value_inr: number
  expected_growth_pct: number
  confidence: 'Low' | 'Medium' | 'High'
  notes: string
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
