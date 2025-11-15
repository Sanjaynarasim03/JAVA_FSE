# Advanced Quantitative Portfolio Generator

## 🎯 Overview

Production-grade **AI-powered portfolio allocation system** designed for finance professionals, implementing institutional-quality quantitative methods including:

- **Ensemble Scoring Model**: Multi-factor analysis combining momentum, fundamentals, volatility, regression, and macro signals
- **Risk-Adjusted Metrics**: Sharpe ratio, maximum drawdown, portfolio volatility, CAGR
- **Backtesting Framework**: Rolling-window simulation with realized returns
- **Strict Financial Controls**: Allocation caps, diversification rules, transaction cost modeling

---

## 🏦 Target Audience

**Finance-literate stakeholders:**
- Quantitative Analysts
- Portfolio Managers
- FinTech Product Owners
- Institutional Investors
- Financial Advisors (RIAs)

---

## 📊 Key Features

### 1. **Ensemble Scoring Engine**

Each stock receives a composite score from weighted components:

| Component | Description | Weight (Low Risk) | Weight (Moderate) | Weight (High Risk) |
|-----------|-------------|-------------------|-------------------|-------------------|
| **Momentum** | Recent price action & trend strength | 15% | 25% | 35% |
| **Fundamental** | PE ratio, dividend yield, market cap | 35% | 25% | 15% |
| **Volatility** | Beta-adjusted risk (inverse scoring) | 30% | 20% | 10% |
| **Regression** | Lightweight predictive model | 15% | 25% | 35% |
| **Macro/Sector** | Sector rotation & economic cycle | 5% | 5% | 5% |

### 2. **Risk Management Framework**

- **Allocation Caps**: 
  - Low risk: 35% max per stock
  - Moderate: 50% max
  - High: 60% max
  
- **Diversification Rules**:
  - Auto mode: 2-5 stocks
  - Single mode: 1 stock (high conviction)
  - Multiple mode: 3-7 stocks

- **Volatility Estimation**: Beta-adjusted using NSE Nifty baseline (~18% annual vol)

### 3. **Financial Metrics**

Returns **institutional-grade** portfolio statistics:

- **CAGR** (Compound Annual Growth Rate)
- **Sharpe Ratio** (excess return per unit risk, RFR default = 6.5%)
- **Maximum Drawdown** (estimated from historical volatility)
- **Portfolio Volatility** (weighted component vols)
- **Transaction Costs** (0.05% per trade)

### 4. **Backtesting**

- Monthly rebalancing simulation
- Realized annualized return vs. predicted
- Average Sharpe ratio over test periods
- Turnover analysis

---

## 🚀 API Usage

### Endpoint: `POST /api/advanced-portfolio`

#### Request Schema

```json
{
  "investment_amount_inr": 50000,
  "duration_months": 36,
  "risk_preference": "moderate",
  "mode": "auto",
  "preferred_tickers": ["TCS.NS", "RELIANCE.NS"],
  "latest_prices": {
    "TCS.NS": 3850,
    "RELIANCE.NS": 2600,
    "INFY.NS": 1500
  },
  "rfr_annual_pct": 6.5
}
```

#### Response Schema

```json
{
  "status": "ok",
  "message": "Successfully generated moderate risk portfolio...",
  "investment_amount_inr": 50000,
  "duration_months": 36,
  "risk_preference": "moderate",
  "mode": "auto",
  "model_metadata": {
    "model_type": "Lightweight-ensemble",
    "model_version": "v2.1.0",
    "generation_timestamp": "2025-11-15T10:30:00Z",
    "model_confidence_score": "High",
    "ensemble_weights": {
      "momentum": 0.25,
      "fundamental": 0.25,
      "volatility": 0.20,
      "regression": 0.25,
      "macro": 0.05
    }
  },
  "allocations": [
    {
      "rank": 1,
      "company": "Tata Consultancy Services",
      "ticker": "TCS.NS",
      "allocation_inr": 25000,
      "allocation_pct": 50.0,
      "shares": 6,
      "entry_price_inr": 3850.0,
      "predicted_return_pct": 62.5,
      "predicted_value_inr": 40625,
      "risk_level": "Low",
      "liquidity_flag": "Good",
      "rationale_short": "Strong IT fundamentals; attractive valuation, liquidity."
    }
  ],
  "total_expected_value_inr": 75000,
  "expected_growth_pct": 50.0,
  "predicted_annualized_return_pct": 14.47,
  "predicted_portfolio_volatility_pct": 15.8,
  "predicted_sharpe_ratio": 0.50,
  "predicted_max_drawdown_pct": -23.7,
  "unallocated_cash_inr": 50,
  "estimated_transaction_cost_inr": 12,
  "backtest_summary": {
    "backtest_possible": true,
    "periods_tested": ["2022-11-15 to 2025-11-15"],
    "realized_annualized_return_pct": 16.2,
    "realized_sharpe_ratio": 0.54,
    "realized_max_drawdown_pct": -22.0,
    "avg_annual_turnover_pct": 35.0
  },
  "notes": "Moderate risk portfolio with 4 allocation(s). Medium-term growth...",
  "disclaimer": "This is an AI-based financial simulation and not financial advice."
}
```

---

## 💻 TypeScript Integration

```typescript
import { generateAdvancedPortfolio, AdvancedInvestmentParams } from '@/lib/advancedPortfolioGenerator'

const params: AdvancedInvestmentParams = {
  investment_amount_inr: 100000,
  duration_months: 36,
  risk_preference: 'moderate',
  mode: 'auto',
  rfr_annual_pct: 6.5
}

const portfolio = generateAdvancedPortfolio(params)

console.log(`CAGR: ${portfolio.predicted_annualized_return_pct}%`)
console.log(`Sharpe: ${portfolio.predicted_sharpe_ratio}`)
console.log(`Max DD: ${portfolio.predicted_max_drawdown_pct}%`)
```

---

## 📈 Investment Constraints

| Parameter | Minimum | Maximum | Allowed Values |
|-----------|---------|---------|----------------|
| Investment Amount | ₹2,000 | ₹10,00,000 | Any integer |
| Duration (months) | 3 | 60 | 3, 6, 12, 24, 36, 48, 60 |
| Risk Preference | - | - | low, moderate, high |
| Mode | - | - | auto, single, multiple |

---

## 🧮 Model Logic

### Ensemble Score Calculation

For each ticker `i`:

```
EnsembleScore[i] = w₁·Momentum[i] + w₂·Fundamental[i] + w₃·Volatility[i] + w₄·Regression[i] + w₅·Macro[i]
```

Where weights `w` are risk-preference dependent (see table above).

### Predicted Return Mapping

```
Annual Return = (EnsembleScore / 100) × 25% × RiskMultiplier
Total Return = (1 + AnnualReturn)^Years - 1
```

### Sharpe Ratio

```
Sharpe = (CAGR - RFR) / PortfolioVolatility
```

### Max Drawdown Estimate

```
MaxDD = PortfolioVolatility × Multiplier
```

Where `Multiplier = {low: 1.2, moderate: 1.5, high: 1.8}`

---

## 🔍 Validation & Error Handling

**Input Validation:**
- Amount < ₹2,000 or > ₹10,00,000 → `status: "error"`
- Invalid duration → Error message
- Invalid tickers → Excluded with notification in `notes`

**Graceful Degradation:**
- If Yahoo Finance API fails → Uses fallback prices from `MARKET_DATA`
- Sets `model_confidence_score: "Low"` when live data unavailable

---

## 🎓 Demo Usage

```bash
# Run the demo script
npx ts-node demo-advanced-portfolio.ts
```

**Output:**
1. Human-readable 2-4 sentence summary (finance tone)
2. Complete JSON response with all metrics

---

## 📚 Key Assumptions

1. **Risk-Free Rate**: Default 6.5% (India 10Y G-Sec)
2. **Trading Days**: 252 per year (NSE calendar)
3. **Transaction Costs**: 0.05% per trade (brokerage + taxes)
4. **Backtesting**: Monthly rebalancing, 35% avg annual turnover
5. **Correlation**: Simplified (zero correlation assumed for volatility calc)

---

## 🔒 Compliance & Disclaimer

> **This is an AI-based financial simulation and not financial advice.**

- Not SEBI-registered investment advice
- For educational and simulation purposes only
- Past performance does not guarantee future results
- Users should consult registered financial advisors
- Markets involve risk; principal loss is possible

---

## 🛠️ Tech Stack

- **TypeScript** (strict mode)
- **Next.js 15** API routes
- **Yahoo Finance 2** (live price feeds)
- **Ensemble ML** (lightweight scoring)

---

## 📞 Support

For institutional licensing or custom quantitative strategies:
- 📧 Email: support@intelliinvest.ai
- 🌐 Web: https://github.com/Sanjaynarasim03/INTELLiINVEST

---

## 📄 License

MIT License - See LICENSE file for details

---

**Version**: 2.1.0  
**Last Updated**: November 2025  
**Maintained by**: Quantitative Engineering Team @ INTELLiINVEST
