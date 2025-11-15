import { MARKET_DATA, SECTOR_ALLOCATIONS } from './marketData'
import { getHistoricalReturn, HISTORICAL_RETURNS } from './historicalReturns'
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

  // For low investment amounts, filter stocks by price affordability
  const entryPrices = selectedStocks.map(stock => livePrices?.[stock.ticker] ?? stock.data.price)
  const maxAffordablePrice = investment_amount * 0.8 // Allow up to 80% for one stock
  
  // Filter affordable stocks for low investment amounts
  const affordableStocks = investment_amount < 50000 
    ? selectedStocks.filter((stock, idx) => entryPrices[idx] <= maxAffordablePrice)
    : selectedStocks
  
  // If no affordable stocks, use the cheapest one
  const stocksToAllocate = affordableStocks.length > 0 
    ? affordableStocks.slice(0, Math.min(affordableStocks.length, numStocks))
    : [selectedStocks.sort((a, b) => {
        const priceA = livePrices?.[a.ticker] ?? a.data.price
        const priceB = livePrices?.[b.ticker] ?? b.data.price
        return priceA - priceB
      })[0]]

  const adjustedTotalScore = stocksToAllocate.reduce((sum, stock) => sum + stock.score, 0)

  stocksToAllocate.forEach((stock, index) => {
    const isLast = index === stocksToAllocate.length - 1
    const allocationPercentage = stock.score / adjustedTotalScore
    
    let allocationAmount: number
    if (isLast) {
      allocationAmount = remainingAmount // Use remaining amount for last stock
    } else {
      allocationAmount = Math.floor(investment_amount * allocationPercentage)
    }

    const entryPrice = livePrices?.[stock.ticker] ?? stock.data.price
    const shares = Math.floor(allocationAmount / entryPrice)
    const actualAllocation = shares * entryPrice
    
    // Skip if shares would be 0
    if (shares === 0) {
      // Don't subtract anything if we're skipping this stock
      return
    }
    
    // Update remaining amount with actual spent (not planned)
    if (!isLast) {
      remainingAmount -= actualAllocation
    }

    // Calculate expected returns based on duration, risk, and HISTORICAL DATA
    // Use deterministic profitable returns based on stock fundamentals + historical performance
    let expectedReturn: number
    
    // Get historical return as baseline
    const historicalReturn = getHistoricalReturn(stock.ticker, duration_months)
    
    // Base return from stock quality (PE, dividend, beta)
    const qualityScore = stock.score / 12 // Normalize to 0-1 range
    const fundamentalBoost = stock.data.dividend * 2 + (stock.data.pe < 25 ? 3 : 0)
    
    // Define minimum guaranteed returns for each duration
    let minGuaranteedReturn: number
    let fundamentalProjection: number
    
    switch (duration_months) {
      case 3: // 3 months - minimum 4-12% profit
        minGuaranteedReturn = risk_preference === 'low' ? 4 : risk_preference === 'moderate' ? 7 : 10
        fundamentalProjection = risk_preference === 'low' ? 
          6 + qualityScore * 4 : 
          risk_preference === 'moderate' ? 
          10 + qualityScore * 5 : 
          12 + qualityScore * 7
        break
      case 6: // 6 months - minimum 8-20% profit
        minGuaranteedReturn = risk_preference === 'low' ? 8 : risk_preference === 'moderate' ? 12 : 16
        fundamentalProjection = risk_preference === 'low' ? 
          12 + qualityScore * 6 + fundamentalBoost : 
          risk_preference === 'moderate' ? 
          18 + qualityScore * 8 + fundamentalBoost : 
          24 + qualityScore * 10 + fundamentalBoost
        break
      case 12: // 1 year - minimum 15-35% profit
        minGuaranteedReturn = risk_preference === 'low' ? 15 : risk_preference === 'moderate' ? 22 : 30
        fundamentalProjection = risk_preference === 'low' ? 
          22 + qualityScore * 10 + fundamentalBoost * 1.5 : 
          risk_preference === 'moderate' ? 
          30 + qualityScore * 12 + fundamentalBoost * 1.5 : 
          42 + qualityScore * 18 + fundamentalBoost * 1.5
        break
      case 24: // 2 years - minimum 30-65% profit
        minGuaranteedReturn = risk_preference === 'low' ? 30 : risk_preference === 'moderate' ? 45 : 60
        fundamentalProjection = risk_preference === 'low' ? 
          40 + qualityScore * 18 + fundamentalBoost * 2 : 
          risk_preference === 'moderate' ? 
          55 + qualityScore * 25 + fundamentalBoost * 2 : 
          75 + qualityScore * 30 + fundamentalBoost * 2
        break
      case 36: // 3 years - minimum 50-100% profit
        minGuaranteedReturn = risk_preference === 'low' ? 50 : risk_preference === 'moderate' ? 70 : 90
        fundamentalProjection = risk_preference === 'low' ? 
          60 + qualityScore * 25 + fundamentalBoost * 2.5 : 
          risk_preference === 'moderate' ? 
          85 + qualityScore * 30 + fundamentalBoost * 2.5 : 
          120 + qualityScore * 40 + fundamentalBoost * 2.5
        break
      case 60: // 5 years - minimum 90-180% profit
        minGuaranteedReturn = risk_preference === 'low' ? 90 : risk_preference === 'moderate' ? 130 : 170
        fundamentalProjection = risk_preference === 'low' ? 
          100 + qualityScore * 35 + fundamentalBoost * 3 : 
          risk_preference === 'moderate' ? 
          145 + qualityScore * 45 + fundamentalBoost * 3 : 
          200 + qualityScore * 65 + fundamentalBoost * 3
        break
      default:
        minGuaranteedReturn = 12
        fundamentalProjection = 15 + qualityScore * 6
    }
    
    // Blend historical data with fundamentals, but ensure minimum returns
    // Use 40% historical (if available) + 60% fundamental for better profitability
    if (historicalReturn && historicalReturn > 0) {
      const blendedReturn = (historicalReturn * 0.4) + (fundamentalProjection * 0.6)
      // Take the higher of blended return or minimum guaranteed
      expectedReturn = Math.max(blendedReturn, minGuaranteedReturn)
    } else {
      // No historical data - use fundamental projection with minimum guarantee
      expectedReturn = Math.max(fundamentalProjection, minGuaranteedReturn)
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
