/**
 * Historical Returns Data & Backtesting
 * 
 * Simulated historical performance data for Indian stocks
 * In production, this would pull actual historical data from market APIs
 */

export interface HistoricalReturn {
  ticker: string
  returns_3m: number  // 3-month historical return %
  returns_6m: number  // 6-month historical return %
  returns_1y: number  // 1-year historical return %
  returns_2y: number  // 2-year annualized return %
  returns_3y: number  // 3-year annualized return %
  returns_5y: number  // 5-year annualized return %
  volatility_annual: number // Annual volatility %
  max_drawdown: number // Maximum drawdown %
  sharpe_ratio: number // Historical Sharpe ratio
}

/**
 * Simulated historical returns based on real market patterns
 * These approximate actual NSE stock performance (2019-2024)
 */
export const HISTORICAL_RETURNS: Record<string, HistoricalReturn> = {
  'TCS.NS': {
    ticker: 'TCS.NS',
    returns_3m: 5.2,
    returns_6m: 11.8,
    returns_1y: 22.5,
    returns_2y: 18.3,
    returns_3y: 16.8,
    returns_5y: 19.2,
    volatility_annual: 16.5,
    max_drawdown: -18.2,
    sharpe_ratio: 0.78
  },
  'RELIANCE.NS': {
    ticker: 'RELIANCE.NS',
    returns_3m: 6.5,
    returns_6m: 14.2,
    returns_1y: 28.7,
    returns_2y: 22.4,
    returns_3y: 19.5,
    returns_5y: 16.8,
    volatility_annual: 22.3,
    max_drawdown: -25.6,
    sharpe_ratio: 0.71
  },
  'INFY.NS': {
    ticker: 'INFY.NS',
    returns_3m: 4.8,
    returns_6m: 10.5,
    returns_1y: 20.3,
    returns_2y: 17.8,
    returns_3y: 15.2,
    returns_5y: 18.5,
    volatility_annual: 18.2,
    max_drawdown: -19.8,
    sharpe_ratio: 0.72
  },
  'HDFCBANK.NS': {
    ticker: 'HDFCBANK.NS',
    returns_3m: 3.5,
    returns_6m: 8.2,
    returns_1y: 16.8,
    returns_2y: 14.5,
    returns_3y: 12.8,
    returns_5y: 15.2,
    volatility_annual: 15.8,
    max_drawdown: -16.5,
    sharpe_ratio: 0.62
  },
  'ICICIBANK.NS': {
    ticker: 'ICICIBANK.NS',
    returns_3m: 7.2,
    returns_6m: 16.5,
    returns_1y: 32.8,
    returns_2y: 26.5,
    returns_3y: 22.3,
    returns_5y: 19.8,
    volatility_annual: 24.5,
    max_drawdown: -28.3,
    sharpe_ratio: 0.85
  },
  'HINDUNILVR.NS': {
    ticker: 'HINDUNILVR.NS',
    returns_3m: 2.8,
    returns_6m: 6.5,
    returns_1y: 12.5,
    returns_2y: 10.8,
    returns_3y: 9.5,
    returns_5y: 12.3,
    volatility_annual: 12.5,
    max_drawdown: -12.8,
    sharpe_ratio: 0.48
  },
  'ITC.NS': {
    ticker: 'ITC.NS',
    returns_3m: 4.2,
    returns_6m: 9.8,
    returns_1y: 18.5,
    returns_2y: 15.2,
    returns_3y: 13.8,
    returns_5y: 14.5,
    volatility_annual: 14.2,
    max_drawdown: -15.5,
    sharpe_ratio: 0.68
  },
  'WIPRO.NS': {
    ticker: 'WIPRO.NS',
    returns_3m: 3.8,
    returns_6m: 8.5,
    returns_1y: 16.2,
    returns_2y: 14.8,
    returns_3y: 13.2,
    returns_5y: 15.8,
    volatility_annual: 19.5,
    max_drawdown: -21.2,
    sharpe_ratio: 0.58
  },
  'SBIN.NS': {
    ticker: 'SBIN.NS',
    returns_3m: 8.5,
    returns_6m: 18.2,
    returns_1y: 38.5,
    returns_2y: 30.2,
    returns_3y: 25.8,
    returns_5y: 22.5,
    volatility_annual: 28.5,
    max_drawdown: -32.5,
    sharpe_ratio: 0.92
  },
  'BHARTIARTL.NS': {
    ticker: 'BHARTIARTL.NS',
    returns_3m: 6.8,
    returns_6m: 15.2,
    returns_1y: 28.5,
    returns_2y: 24.8,
    returns_3y: 21.5,
    returns_5y: 19.2,
    volatility_annual: 21.8,
    max_drawdown: -24.5,
    sharpe_ratio: 0.82
  },
  'AXISBANK.NS': {
    ticker: 'AXISBANK.NS',
    returns_3m: 7.8,
    returns_6m: 17.5,
    returns_1y: 34.2,
    returns_2y: 28.5,
    returns_3y: 24.2,
    returns_5y: 21.5,
    volatility_annual: 26.5,
    max_drawdown: -30.2,
    sharpe_ratio: 0.88
  },
  'TATAMOTORS.NS': {
    ticker: 'TATAMOTORS.NS',
    returns_3m: 12.5,
    returns_6m: 28.5,
    returns_1y: 58.5,
    returns_2y: 45.2,
    returns_3y: 38.5,
    returns_5y: 32.5,
    volatility_annual: 38.5,
    max_drawdown: -42.5,
    sharpe_ratio: 1.15
  },
  'SUNPHARMA.NS': {
    ticker: 'SUNPHARMA.NS',
    returns_3m: 3.2,
    returns_6m: 7.8,
    returns_1y: 14.5,
    returns_2y: 12.8,
    returns_3y: 11.2,
    returns_5y: 13.5,
    volatility_annual: 16.8,
    max_drawdown: -18.5,
    sharpe_ratio: 0.52
  },
  'MARUTI.NS': {
    ticker: 'MARUTI.NS',
    returns_3m: 5.8,
    returns_6m: 13.5,
    returns_1y: 25.8,
    returns_2y: 21.5,
    returns_3y: 18.5,
    returns_5y: 17.2,
    volatility_annual: 24.5,
    max_drawdown: -26.8,
    sharpe_ratio: 0.68
  },
  'BAJFINANCE.NS': {
    ticker: 'BAJFINANCE.NS',
    returns_3m: 9.5,
    returns_6m: 21.5,
    returns_1y: 42.5,
    returns_2y: 35.8,
    returns_3y: 32.5,
    returns_5y: 28.5,
    volatility_annual: 32.5,
    max_drawdown: -38.5,
    sharpe_ratio: 1.05
  },
  'ADANIPORTS.NS': {
    ticker: 'ADANIPORTS.NS',
    returns_3m: 8.2,
    returns_6m: 19.5,
    returns_1y: 38.5,
    returns_2y: 32.5,
    returns_3y: 28.5,
    returns_5y: 25.8,
    volatility_annual: 35.2,
    max_drawdown: -40.5,
    sharpe_ratio: 0.95
  },
  'LT.NS': {
    ticker: 'LT.NS',
    returns_3m: 6.2,
    returns_6m: 14.8,
    returns_1y: 27.5,
    returns_2y: 23.5,
    returns_3y: 20.5,
    returns_5y: 19.2,
    volatility_annual: 22.5,
    max_drawdown: -25.5,
    sharpe_ratio: 0.78
  }
}

/**
 * Get historical return for a specific duration
 */
export function getHistoricalReturn(ticker: string, durationMonths: number): number | null {
  const hist = HISTORICAL_RETURNS[ticker]
  if (!hist) return null

  switch (durationMonths) {
    case 3: return hist.returns_3m
    case 6: return hist.returns_6m
    case 12: return hist.returns_1y
    case 24: return hist.returns_2y
    case 36: return hist.returns_3y
    case 60: return hist.returns_5y
    default: {
      // Interpolate for other durations
      const years = durationMonths / 12
      if (years <= 1) return hist.returns_1y * years
      if (years <= 3) return hist.returns_3y
      return hist.returns_5y
    }
  }
}

/**
 * Calculate portfolio historical Sharpe ratio
 */
export function calculatePortfolioSharpe(
  tickers: string[],
  weights: number[],
  riskFreeRate: number = 6.5
): number {
  let weightedReturn = 0
  let weightedVol = 0

  tickers.forEach((ticker, idx) => {
    const hist = HISTORICAL_RETURNS[ticker]
    if (hist) {
      weightedReturn += weights[idx] * hist.returns_1y
      weightedVol += weights[idx] * hist.volatility_annual
    }
  })

  const excessReturn = weightedReturn - riskFreeRate
  return weightedVol > 0 ? excessReturn / weightedVol : 0
}

/**
 * Get backtesting confidence level
 */
export function getBacktestConfidence(
  tickers: string[],
  projectedReturn: number,
  durationMonths: number
): 'Low' | 'Medium' | 'High' {
  // Compare projected vs historical returns
  const historicalReturns = tickers
    .map(t => getHistoricalReturn(t, durationMonths))
    .filter(r => r !== null) as number[]

  if (historicalReturns.length === 0) return 'Low'

  const avgHistorical = historicalReturns.reduce((a, b) => a + b, 0) / historicalReturns.length
  const deviation = Math.abs(projectedReturn - avgHistorical) / avgHistorical

  if (deviation < 0.2) return 'High'  // Within 20% of historical
  if (deviation < 0.4) return 'Medium' // Within 40% of historical
  return 'Low'
}
