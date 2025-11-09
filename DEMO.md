# Demo Instructions

## How to Use the AI Financial Advisor

1. **Open the Application**
   - Navigate to http://localhost:3000 after starting the dev server
   - You'll see a clean, modern interface

2. **Fill Out Investment Parameters**
   - **Investment Amount**: Enter between ₹10,000 and ₹1,00,00,000
   - **Duration**: Choose from 3 months, 6 months, 1 year, 2 years, 3 years, or 5 years
   - **Risk Preference**: Select Low, Moderate, or High
   - **Selection Mode**: Pick Auto (recommended), Single, or Multiple
   - **Preferred Stocks** (optional): Enter NSE tickers like "TCS.NS, RELIANCE.NS"

3. **Generate Portfolio**
   - Click "Generate AI Portfolio"
   - Wait for the AI to analyze and create your portfolio

4. **Review Results**
   - See portfolio summary with expected returns
   - Review detailed stock allocations
   - Read investment rationale for each stock
   - Check the machine-readable JSON output

## Sample Input for Testing:
- Amount: ₹2,00,000
- Duration: 1 year (recommended)  
- Risk: Moderate
- Mode: Auto
- Preferred: Leave empty

## Expected Output:
- 3-4 carefully selected stocks
- Balanced allocation across sectors
- Expected growth varies by duration:
  - 3-6 months: 5-15% growth
  - 1-2 years: 15-35% growth  
  - 3-5 years: 35-100%+ growth
- Detailed rationale for each pick

## Live Demo Example

**Input:** ₹1,000, 6 months, Moderate risk, Auto mode

**AI Financial Advisor Output:**

Summary: Allocate ₹1,000 across 3 stocks for a balanced 6-month growth strategy (moderate risk).

**Allocations:**
1. HDFC Bank — HDFCBANK.NS — ₹324 — shares: 0 — entry_price: ₹1,620 — expected_return: +14.2% → expected_value: ₹370 — Risk: Low — Rationale: Strong fundamentals with attractive valuation and stable business model.

2. ICICI Bank — ICICIBANK.NS — ₹354 — shares: 0 — entry_price: ₹1,180 — expected_return: +13.8% → expected_value: ₹403 — Risk: Moderate — Rationale: Strong fundamentals with decent dividend yield and stable business model.

3. Infosys Limited — INFY.NS — ₹322 — shares: 0 — entry_price: ₹1,750 — expected_return: +16.5% → expected_value: ₹375 — Risk: Low — Rationale: Strong fundamentals with attractive valuation and export growth potential.

**Portfolio Totals:**
- Total invested: ₹1,000
- Total expected value: ₹1,148  
- Expected growth: +14.8%
- Confidence: High

**Next Steps:** Place buy orders at market price; monitor quarterly results; consider adding more stocks for better diversification.

**JSON Output:**
```json
{
  "investment_amount_inr": 1000,
  "duration_months": 6,
  "risk_preference": "moderate",
  "allocations": [
    {
      "rank": 1,
      "company": "HDFC Bank",
      "ticker": "HDFCBANK.NS", 
      "allocation_inr": 324,
      "shares": 0,
      "entry_price_inr": 1620,
      "expected_return_pct": 14.2,
      "expected_value_inr": 370,
      "risk": "Low",
      "rationale": "Strong fundamentals with attractive valuation and stable business model."
    },
    {
      "rank": 2,
      "company": "ICICI Bank",
      "ticker": "ICICIBANK.NS",
      "allocation_inr": 354, 
      "shares": 0,
      "entry_price_inr": 1180,
      "expected_return_pct": 13.8,
      "expected_value_inr": 403,
      "risk": "Moderate",
      "rationale": "Strong fundamentals with decent dividend yield and stable business model."
    },
    {
      "rank": 3,
      "company": "Infosys Limited",
      "ticker": "INFY.NS",
      "allocation_inr": 322,
      "shares": 0, 
      "entry_price_inr": 1750,
      "expected_return_pct": 16.5,
      "expected_value_inr": 375,
      "risk": "Low",
      "rationale": "Strong fundamentals with attractive valuation and export growth potential."
    }
  ],
  "total_expected_value_inr": 1148,
  "expected_growth_pct": 14.8,
  "confidence": "High",
  "notes": "Moderate risk portfolio with 3 stocks. Balanced growth with moderate risk. Consider adding more stocks for better diversification."
}
```

**Disclaimer:** This is an AI-based simulation and not financial advice.
