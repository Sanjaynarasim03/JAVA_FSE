/**
 * AI Financial Advisor - Test Implementation
 * Demonstrates the exact functionality with sample inputs
 */

// Mock the portfolio generation for demonstration
function generateAIPortfolio(inputs) {
  const { investment_amount, duration_months, risk_preference, mode } = inputs;
  
  // Simulate AI analysis with realistic Indian stock data
  const mockPortfolio = {
    investment_amount_inr: investment_amount,
    duration_months: duration_months,
    risk_preference: risk_preference,
    allocations: [
      {
        rank: 1,
        company: "HDFC Bank",
        ticker: "HDFCBANK.NS",
        allocation_inr: Math.floor(investment_amount * 0.324),
        shares: Math.floor((investment_amount * 0.324) / 1620),
        entry_price_inr: 1620,
        expected_return_pct: 14.2,
        expected_value_inr: Math.floor((investment_amount * 0.324) * 1.142),
        risk: "Low",
        rationale: "Strong fundamentals with attractive valuation and stable business model."
      },
      {
        rank: 2,
        company: "ICICI Bank", 
        ticker: "ICICIBANK.NS",
        allocation_inr: Math.floor(investment_amount * 0.354),
        shares: Math.floor((investment_amount * 0.354) / 1180),
        entry_price_inr: 1180,
        expected_return_pct: 13.8,
        expected_value_inr: Math.floor((investment_amount * 0.354) * 1.138),
        risk: "Moderate",
        rationale: "Strong fundamentals with decent dividend yield and stable business model."
      },
      {
        rank: 3,
        company: "Infosys Limited",
        ticker: "INFY.NS", 
        allocation_inr: Math.floor(investment_amount * 0.322),
        shares: Math.floor((investment_amount * 0.322) / 1750),
        entry_price_inr: 1750,
        expected_return_pct: 16.5,
        expected_value_inr: Math.floor((investment_amount * 0.322) * 1.165),
        risk: "Low",
        rationale: "Strong fundamentals with attractive valuation and export growth potential."
      }
    ]
  };

  // Calculate totals
  const totalInvested = mockPortfolio.allocations.reduce((sum, alloc) => sum + alloc.allocation_inr, 0);
  const totalExpected = mockPortfolio.allocations.reduce((sum, alloc) => sum + alloc.expected_value_inr, 0);
  const growthPct = ((totalExpected - totalInvested) / totalInvested * 100);

  mockPortfolio.total_expected_value_inr = totalExpected;
  mockPortfolio.expected_growth_pct = Math.round(growthPct * 10) / 10;
  mockPortfolio.confidence = "High";
  mockPortfolio.notes = `${risk_preference.charAt(0).toUpperCase() + risk_preference.slice(1)} risk portfolio with ${mockPortfolio.allocations.length} stocks. Balanced growth with moderate risk. Consider adding more stocks for better diversification.`;

  return mockPortfolio;
}

// Test with user inputs from example
const userInputs = {
  investment_amount: 1000,
  duration_months: 6,
  risk_preference: 'moderate',
  mode: 'auto',
  preferred_tickers: []
};

console.log('🚀 AI Financial Advisor - Indian Stock Market');
console.log('=' + '='.repeat(48));
console.log('Input Parameters:');
console.log(`• Investment Amount: ₹${userInputs.investment_amount.toLocaleString()}`);
console.log(`• Duration: ${userInputs.duration_months} months`);
console.log(`• Risk Preference: ${userInputs.risk_preference}`);
console.log(`• Mode: ${userInputs.mode}`);
console.log(`• Preferred Tickers: ${userInputs.preferred_tickers.length ? userInputs.preferred_tickers.join(', ') : 'None'}`);
console.log('');

// Generate portfolio
const portfolio = generateAIPortfolio(userInputs);

// Human-readable output
console.log(`📊 Summary: Allocate ₹${portfolio.investment_amount_inr.toLocaleString()} across ${portfolio.allocations.length} stocks for a balanced ${portfolio.duration_months}-month growth strategy (${portfolio.risk_preference} risk).`);
console.log('');
console.log('📈 Allocations:');

portfolio.allocations.forEach((allocation) => {
  console.log(`${allocation.rank}. ${allocation.company} — ${allocation.ticker} — ₹${allocation.allocation_inr} — shares: ${allocation.shares} — entry_price: ₹${allocation.entry_price_inr.toLocaleString()} — expected_return: +${allocation.expected_return_pct}% → expected_value: ₹${allocation.expected_value_inr} — Risk: ${allocation.risk} — Rationale: ${allocation.rationale}`);
});

console.log('');
console.log('💰 Portfolio Totals:');
console.log(`Total invested: ₹${portfolio.investment_amount_inr.toLocaleString()}`);
console.log(`Total expected value: ₹${portfolio.total_expected_value_inr.toLocaleString()}`);
console.log(`Expected growth: +${portfolio.expected_growth_pct}%`);
console.log(`Confidence: ${portfolio.confidence}`);

console.log('');
console.log('🎯 Next steps: Place buy orders at market price (or set limit orders within 2% of entry_price); rebalance after 3 months; set stop-loss at 8% below entry for high-risk stocks.');

console.log('');
console.log('📄 JSON:');
console.log(JSON.stringify(portfolio, null, 0));

console.log('');
console.log('⚠️  This is an AI-based financial simulation, not financial advice.');
