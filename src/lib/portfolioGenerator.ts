import { MARKET_DATA, SECTOR_ALLOCATIONS } from './marketData'
import type { InvestmentParams, PortfolioAllocation, StockAllocation } from '../types/portfolio'

// Optional live price map can be provided to override static prices
export type LivePriceMap = Record<string, number>
export function generatePortfolio(params: InvestmentParams, livePrices?: LivePriceMap): PortfolioAllocation {
  const { investment_amount, duration_months, risk_preference, mode, preferred_tickers } = params

  // Filter stocks based on risk preference
  let availableStocks = Object.entries(MARKET_DATA).filter(([ticker, stockData]) => {
    if (preferred_tickers && preferred_tickers.length > 0) {
      return preferred_tickers.includes(ticker)
    }
    
    // Filter by risk preference
    if (risk_preference === 'low') {
      return stockData.risk === 'Low' || (stockData.risk === 'Moderate' && stockData.beta < 1.0)
    } else if (risk_preference === 'moderate') {
      return stockData.risk === 'Low' || stockData.risk === 'Moderate'
    } else {
      return true // High risk includes all
    }
  })

  // Determine number of stocks based on mode
  let numStocks: number
  if (mode === 'single') {
    numStocks = 1
  } else if (mode === 'multiple') {
    numStocks = Math.min(5, availableStocks.length)
  } else { // auto
    numStocks = risk_preference === 'high' ? 3 : risk_preference === 'moderate' ? 4 : 3
  }

  // Select top stocks based on scoring algorithm
  const scoredStocks = availableStocks.map(([ticker, stockData]) => {
    let score = 0
    
    // PE ratio scoring (lower is better)
    if (stockData.pe < 20) score += 3
    else if (stockData.pe < 30) score += 2
    else score += 1

    // Dividend yield scoring
    if (stockData.dividend > 2) score += 3
    else if (stockData.dividend > 1) score += 2
    else score += 1

    // Beta scoring based on risk preference
    if (risk_preference === 'low' && stockData.beta < 1.0) score += 3
    else if (risk_preference === 'moderate' && stockData.beta <= 1.2) score += 2
    else if (risk_preference === 'high' && stockData.beta > 1.2) score += 3
    else score += 1

    // Market cap preference (favor large cap for lower risk)
    if (stockData.marketCap === 'Large') {
      score += risk_preference === 'low' ? 3 : risk_preference === 'moderate' ? 2 : 1
    }

    return { ticker, data: stockData, score }
  })

  // Sort by score and select top stocks
  const selectedStocks = scoredStocks
    .sort((a, b) => b.score - a.score)
    .slice(0, numStocks)

  // Calculate allocations
  const allocations: StockAllocation[] = []
  let remainingAmount = investment_amount
  const totalScore = selectedStocks.reduce((sum, stock) => sum + stock.score, 0)

  selectedStocks.forEach((stock, index) => {
    const isLast = index === selectedStocks.length - 1
    const allocationPercentage = stock.score / totalScore
    
    let allocationAmount: number
    if (isLast) {
      allocationAmount = remainingAmount // Use remaining amount for last stock
    } else {
      allocationAmount = Math.floor(investment_amount * allocationPercentage)
      remainingAmount -= allocationAmount
    }

  const entryPrice = livePrices?.[stock.ticker] ?? stock.data.price
  const shares = Math.floor(allocationAmount / entryPrice)
  const actualAllocation = shares * entryPrice

    // Calculate expected returns based on duration and risk
    let expectedReturn: number
    const baseMultiplier = duration_months / 12 // Annualized calculation
    
    switch (duration_months) {
      case 3: // 3 months
        expectedReturn = risk_preference === 'low' ? 
          4 + Math.random() * 3 : 
          risk_preference === 'moderate' ? 
          6 + Math.random() * 4 : 
          8 + Math.random() * 7
        break
      case 6: // 6 months  
        expectedReturn = risk_preference === 'low' ? 
          8 + Math.random() * 5 : 
          risk_preference === 'moderate' ? 
          12 + Math.random() * 6 : 
          15 + Math.random() * 10
        break
      case 12: // 1 year
        expectedReturn = risk_preference === 'low' ? 
          15 + Math.random() * 8 : 
          risk_preference === 'moderate' ? 
          20 + Math.random() * 12 : 
          28 + Math.random() * 18
        break
      case 24: // 2 years
        expectedReturn = risk_preference === 'low' ? 
          25 + Math.random() * 15 : 
          risk_preference === 'moderate' ? 
          35 + Math.random() * 20 : 
          50 + Math.random() * 30
        break
      case 36: // 3 years
        expectedReturn = risk_preference === 'low' ? 
          35 + Math.random() * 20 : 
          risk_preference === 'moderate' ? 
          50 + Math.random() * 25 : 
          75 + Math.random() * 40
        break
      case 60: // 5 years
        expectedReturn = risk_preference === 'low' ? 
          55 + Math.random() * 30 : 
          risk_preference === 'moderate' ? 
          85 + Math.random() * 40 : 
          130 + Math.random() * 70
        break
      default:
        expectedReturn = 10 + Math.random() * 5
    }

    const expectedValue = Math.round(actualAllocation * (1 + expectedReturn / 100))

    allocations.push({
      rank: index + 1,
      company: stock.data.company,
      ticker: stock.ticker,
      allocation_inr: actualAllocation,
      shares,
  entry_price_inr: entryPrice,
      expected_return_pct: Math.round(expectedReturn * 100) / 100,
      expected_value_inr: expectedValue,
      risk: stock.data.risk,
      rationale: generateRationale(stock.data, risk_preference, duration_months)
    })
  })

  const totalInvested = allocations.reduce((sum, alloc) => sum + alloc.allocation_inr, 0)
  const totalExpectedValue = allocations.reduce((sum, alloc) => sum + alloc.expected_value_inr, 0)
  const expectedGrowth = ((totalExpectedValue - totalInvested) / totalInvested) * 100

  // Determine confidence based on risk and diversification
  let confidence: 'Low' | 'Medium' | 'High'
  if (numStocks === 1) {
    confidence = 'Low'
  } else if (risk_preference === 'high' || expectedGrowth > 20) {
    confidence = 'Medium'
  } else {
    confidence = 'High'
  }

  return {
    investment_amount_inr: investment_amount,
    duration_months,
    risk_preference,
    allocations,
    total_expected_value_inr: totalExpectedValue,
    expected_growth_pct: Math.round(expectedGrowth * 100) / 100,
    confidence,
    notes: generatePortfolioNotes(risk_preference, numStocks, expectedGrowth, duration_months)
  }
}

function generateRationale(stockData: any, riskPreference: string, duration: number): string {
  const factors: string[] = []
  
  if (stockData.pe < 20) factors.push('attractive valuation')
  if (stockData.dividend > 1.5) factors.push('decent dividend yield')
  if (stockData.beta < 1.0) factors.push('lower volatility')
  if (stockData.marketCap === 'Large') factors.push('established market leader')
  
  const sector = stockData.sector.toLowerCase()
  
  // Duration-specific factors
  if (duration >= 12) {
    if (sector === 'it') factors.push('long-term digital transformation growth')
    if (sector === 'banking') factors.push('compound growth potential')
    if (duration >= 36) {
      factors.push('wealth creation potential')
    }
  } else {
    if (sector === 'it' && duration >= 6) factors.push('export growth potential')
    if (sector === 'banking' && riskPreference !== 'high') factors.push('stable business model')
  }
  
  if (sector === 'fmcg') factors.push('defensive characteristics')
  
  return factors.length > 0 ? 
    `Strong fundamentals with ${factors.slice(0, 2).join(' and ')}.` :
    'Solid fundamentals with growth potential.'
}

function generatePortfolioNotes(riskPreference: string, numStocks: number, expectedGrowth: number, duration?: number): string {
  let notes = `${riskPreference.charAt(0).toUpperCase() + riskPreference.slice(1)} risk portfolio with ${numStocks} stock${numStocks > 1 ? 's' : ''}. `
  
  if (duration && duration >= 36) {
    notes += 'Long-term wealth creation strategy with compounding benefits. '
  } else if (duration && duration >= 12) {
    notes += 'Medium-term growth strategy allowing for market cycles. '
  }
  
  if (expectedGrowth > 50) {
    notes += 'Exceptional growth potential with higher volatility expected. '
  } else if (expectedGrowth > 25) {
    notes += 'Strong growth potential with moderate volatility. '
  } else if (expectedGrowth > 15) {
    notes += 'Solid growth potential but monitor market volatility. '
  } else if (expectedGrowth > 8) {
    notes += 'Balanced growth with moderate risk. '
  } else {
    notes += 'Conservative approach focused on capital preservation. '
  }
  
  notes += numStocks > 3 ? 'Well diversified across sectors.' : 'Consider adding more stocks for better diversification.'
  
  if (duration && duration >= 24) {
    notes += ' Regular portfolio review recommended every 12 months.'
  }
  
  return notes
}
