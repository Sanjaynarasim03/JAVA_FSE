// Test the AI Financial Advisor with sample inputs
import { generatePortfolio } from './src/lib/portfolioGenerator'

// User inputs from example
const testInputs = {
  investment_amount: 1000,
  duration_months: 6,
  risk_preference: 'moderate',
  mode: 'auto',
  preferred_tickers: []
}

console.log('Testing AI Financial Advisor with inputs:')
console.log('Investment Amount: ₹1,000')
console.log('Duration: 6 months')
console.log('Risk Preference: Moderate')
console.log('Mode: Auto')
console.log('Preferred Tickers: None')
console.log('\n' + '='.repeat(50) + '\n')

try {
  const portfolio = generatePortfolio(testInputs)
  
  // Format human-readable output
  console.log(`Summary: Allocate ₹${portfolio.investment_amount_inr.toLocaleString()} across ${portfolio.allocations.length} stocks for a balanced ${portfolio.duration_months}-month growth strategy (${portfolio.risk_preference} risk).`)
  console.log('\nAllocations:')
  
  portfolio.allocations.forEach((allocation, index) => {
    const formatCurrency = (amount) => `₹${amount.toLocaleString()}`
    
    console.log(`${allocation.rank}. ${allocation.company} — ${allocation.ticker} — ${formatCurrency(allocation.allocation_inr)} — shares: ${allocation.shares} — entry_price: ${formatCurrency(allocation.entry_price_inr)} — expected_return: +${allocation.expected_return_pct}% → expected_value: ${formatCurrency(allocation.expected_value_inr)} — Risk: ${allocation.risk} — Rationale: ${allocation.rationale}`)
  })
  
  console.log('\nPortfolio Totals:')
  console.log(`Total invested: ₹${portfolio.investment_amount_inr.toLocaleString()}`)
  console.log(`Total expected value: ₹${portfolio.total_expected_value_inr.toLocaleString()}`)
  console.log(`Expected growth: +${portfolio.expected_growth_pct}%`)
  console.log(`Confidence: ${portfolio.confidence}`)
  
  console.log('\nNext steps: Place buy orders at market price (or set limit orders within 2% of entry_price); rebalance after 3 months; set stop-loss at 8-10% below entry for higher-risk stocks.')
  
  console.log('\nJSON:')
  console.log(JSON.stringify(portfolio, null, 0))
  
  console.log('\nThis is an AI-based financial simulation, not financial advice.')
  
} catch (error) {
  console.error('Error generating portfolio:', error)
}
