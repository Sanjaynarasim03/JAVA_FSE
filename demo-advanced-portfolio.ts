/**
 * Advanced Portfolio Generator Demo
 * 
 * Demonstrates finance-grade portfolio generation with:
 * - Human-readable summary (2-4 sentences)
 * - Complete JSON response with all financial metrics
 */

import { generateAdvancedPortfolio } from './src/lib/advancedPortfolioGenerator'

// Example inputs
const testCases = [
  {
    name: 'Conservative 3-Year Portfolio',
    params: {
      investment_amount_inr: 100000,
      duration_months: 36 as const,
      risk_preference: 'low' as const,
      mode: 'auto' as const,
      preferred_tickers: ['TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ITC.NS'],
      latest_prices: {
        'TCS.NS': 3850,
        'INFY.NS': 1500,
        'HDFCBANK.NS': 1650,
        'ITC.NS': 470,
        'HINDUNILVR.NS': 2650
      },
      rfr_annual_pct: 6.5
    }
  },
  {
    name: 'Moderate Risk 1-Year Portfolio',
    params: {
      investment_amount_inr: 50000,
      duration_months: 12,
      risk_preference: 'moderate' as const,
      mode: 'auto' as const,
      rfr_annual_pct: 6.5
    }
  },
  {
    name: 'Aggressive Growth 5-Year Portfolio',
    params: {
      investment_amount_inr: 250000,
      duration_months: 60,
      risk_preference: 'high' as const,
      mode: 'multiple' as const,
      preferred_tickers: ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'WIPRO.NS'],
      latest_prices: {
        'RELIANCE.NS': 2600,
        'TCS.NS': 3850,
        'INFY.NS': 1500,
        'WIPRO.NS': 450
      },
      rfr_annual_pct: 6.5
    }
  },
  {
    name: 'Error Case: Amount Too Low',
    params: {
      investment_amount_inr: 1500, // Below minimum
      duration_months: 12,
      risk_preference: 'moderate' as const,
      mode: 'auto' as const,
      rfr_annual_pct: 6.5
    }
  }
]

console.log('=' .repeat(80))
console.log('ADVANCED QUANTITATIVE PORTFOLIO GENERATOR - DEMO')
console.log('=' .repeat(80))
console.log()

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`TEST CASE ${index + 1}: ${testCase.name}`)
  console.log('='.repeat(80))
  
  const result = generateAdvancedPortfolio(testCase.params as any)
  
  // HUMAN SUMMARY (Finance-literate, 2-4 sentences)
  console.log('\n📊 EXECUTIVE SUMMARY (Human-Readable):')
  console.log('-'.repeat(80))
  
  if (result.status === 'ok') {
    const summary = generateHumanSummary(result)
    console.log(summary)
  } else {
    console.log(`❌ ERROR: ${result.message}`)
  }
  
  // COMPLETE JSON OUTPUT
  console.log('\n📄 COMPLETE JSON RESPONSE:')
  console.log('-'.repeat(80))
  console.log(JSON.stringify(result, null, 2))
  
  console.log()
})

console.log('\n' + '='.repeat(80))
console.log('DEMO COMPLETED')
console.log('='.repeat(80))

/**
 * Generate 2-4 sentence finance-style human summary
 */
function generateHumanSummary(portfolio: any): string {
  const {
    investment_amount_inr,
    duration_months,
    risk_preference,
    allocations,
    expected_growth_pct,
    predicted_annualized_return_pct,
    predicted_sharpe_ratio,
    predicted_max_drawdown_pct,
    model_metadata
  } = portfolio

  const formatCurrency = (amt: number) => 
    `₹${(amt / 1000).toFixed(0)}K`

  const years = duration_months / 12
  const yearStr = years === 1 ? '1-year' : `${years}-year`

  let summary = `Allocated ${formatCurrency(investment_amount_inr)} across ${allocations.length} `
  summary += `${allocations.map((a: any) => a.ticker).join(', ')} `
  summary += `stocks for a ${yearStr} ${risk_preference}-risk portfolio targeting `
  summary += `${expected_growth_pct.toFixed(1)}% total return `
  summary += `(${predicted_annualized_return_pct.toFixed(1)}% CAGR). `

  if (predicted_sharpe_ratio > 1.0) {
    summary += `Strong risk-adjusted returns with Sharpe ratio of ${predicted_sharpe_ratio.toFixed(2)}, `
  } else if (predicted_sharpe_ratio > 0.5) {
    summary += `Acceptable risk-adjusted returns (Sharpe: ${predicted_sharpe_ratio.toFixed(2)}), `
  } else {
    summary += `Lower Sharpe ratio (${predicted_sharpe_ratio.toFixed(2)}) indicates higher volatility, `
  }

  summary += `estimated max drawdown of ${Math.abs(predicted_max_drawdown_pct).toFixed(1)}%. `

  if (duration_months >= 24) {
    summary += `Semi-annual rebalancing recommended with defensive stops. `
  } else {
    summary += `Quarterly review recommended to manage tactical risk. `
  }

  summary += `Model confidence: ${model_metadata.model_confidence_score}.`

  return summary
}
