# 🚀 INTELLiINVEST v2.0 - Production-Grade AI Financial Advisory System

## 📋 Overview

**INTELLiINVEST** is a production-style full-stack AI-driven financial advisory system that leverages the **RAMENS algorithm** (Risk-Aware Multi-factor Ensemble Normalized Scoring) to generate intelligent, explainable stock portfolios. The system includes advanced features like performance tracking, backtesting, model comparison, and real-time alerts.

---

## 🎯 Key Features

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| **RAMENS Algorithm** | Multi-factor portfolio optimization considering Momentum, Fundamentals, Inverse Beta, Factor Blend, and Macro factors |
| **Explainable AI (XAI)** | Factor contribution breakdown for each stock recommendation |
| **Performance Tracking** | Predicted vs actual return comparison to validate model accuracy |
| **Backtesting** | Historical simulation of portfolio performance over 1-5 years |
| **Model Comparison** | Compare CAPM, Markowitz, and RAMENS approaches side-by-side |
| **Alert System** | Real-time alerts for price drops (>10%) and target price reaches |
| **JWT Authentication** | Secure user authentication with token-based access |
| **CSV Storage** | Local file-based persistence (no cloud required) |
| **Live Market Data** | Yahoo Finance integration for real-time and historical prices |
| **Rich UI** | Responsive Next.js frontend with Recharts visualizations |

---

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Authentication**: JWT (python-jose) + bcrypt
- **Data**: Yahoo Finance (yfinance, requests)
- **Storage**: CSV files (threading-safe)
- **Validation**: Pydantic

### Frontend
- **Framework**: Next.js 15+ (TypeScript)
- **Styling**: Tailwind CSS
- **Charts**: Recharts 2.12+
- **Icons**: Lucide React
- **State**: React Hooks

### Infrastructure
- **No cloud required** - works fully offline with CSV storage
- **Local Yahoo Finance caching** - graceful fallback to cached prices

---

## 📊 System Architecture

### Backend Modules

```
backend/
├── main.py                 # FastAPI app with all endpoints
├── auth.py                 # JWT generation, password hashing
├── ramens.py               # RAMENS algorithm implementation
├── schemas.py              # Pydantic request/response models
├── storage.py              # CSV read/write operations
├── finance_data.py         # Yahoo Finance integration
├── tracking.py             # Performance tracking & comparison
├── backtesting.py          # Historical portfolio simulation
├── models_comparison.py     # CAPM vs Markowitz vs RAMENS
├── alerts.py               # Price drop & target price alerts
└── requirements.txt        # Python dependencies
```

### Frontend Structure

```
src/
├── app/
│   ├── page.tsx            # Home page
│   ├── login/page.tsx       # User login
│   ├── register/page.tsx    # User registration
│   ├── dashboard/page.tsx   # Main dashboard with charts
│   ├── generator/page.tsx   # Portfolio generation form
│   ├── history/page.tsx     # Portfolio history
│   ├── performance/page.tsx # Performance tracking
│   ├── alerts/page.tsx      # Alert management
│   └── models/page.tsx      # Model comparison
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── ExplanationPanel.tsx # XAI factor breakdown
│   ├── AuthForm.tsx         # Auth form component
│   └── PortfolioResults.tsx # Portfolio display
└── lib/
    ├── auth.ts             # Client-side auth utilities
    └── backend.ts          # API client
```

### Data Storage

```
data/
├── users.csv               # User accounts (email, password hash)
├── portfolios.csv          # Generated portfolios
├── tracking.csv            # Performance tracking records
├── alerts.csv              # Alert history
└── top-stocks.json         # Stock universe
```

---

## 🔐 Authentication & Security

### Registration/Login Flow
1. **Register**: User provides email, password, name → password hashed with bcrypt
2. **Login**: Email + password → JWT token (valid 24 hours)
3. **Protected Routes**: JWT token required in `Authorization: Bearer {token}` header
4. **Token Storage**: Stored in browser localStorage (client-side)

### Security Features
- ✅ bcrypt password hashing (with salt rounds)
- ✅ JWT token validation on protected endpoints
- ✅ CORS enabled for localhost:3000
- ✅ Input validation with Pydantic
- ✅ Protected endpoints require authentication

---

## 📈 RAMENS Algorithm

### Factor Weighting by Risk Preference

**Low Risk** (Conservative)
- Momentum: 16%
- Fundamentals: 32% (emphasis on stability)
- Inverse Beta: 25% (low volatility preference)
- Factor Blend: 17%
- Macro: 10%

**Moderate Risk** (Balanced)
- Momentum: 22%
- Fundamentals: 23%
- Inverse Beta: 18%
- Factor Blend: 22%
- Macro: 15%

**High Risk** (Aggressive)
- Momentum: 30% (emphasis on growth)
- Fundamentals: 14%
- Inverse Beta: 10% (volatility acceptable)
- Factor Blend: 26%
- Macro: 20%

### Portfolio Metrics
- **Expected Return**: Probability-weighted sum of individual stock returns
- **Volatility**: Standard deviation of returns
- **Sharpe Ratio**: Return adjusted for risk
- **Max Drawdown**: Largest peak-to-trough decline

---

## 🔌 API Endpoints

### Authentication
```
POST /auth/register           # Register new user
POST /auth/login              # Login user
GET  /me                       # Get current user info
```

### Portfolio Management
```
POST /generate-portfolio      # Generate new portfolio
POST /save-portfolio          # Save portfolio
GET  /get-portfolios          # Get user's portfolio history
```

### Performance Tracking
```
POST /track-performance       # Start tracking a portfolio
GET  /compare-performance     # Compare predicted vs actual return
GET  /performance-summary     # Get aggregated metrics
```

### Backtesting
```
POST /backtest-portfolio      # Backtest single portfolio
POST /compare-backtests       # Compare two portfolios
```

### Model Comparison
```
POST /compare-models          # Compare CAPM, Markowitz, RAMENS
```

### Alerts
```
POST /alerts/create-price-drop        # Create price drop alert
POST /alerts/create-target            # Create target price alert
GET  /alerts                           # Get user's alerts
POST /alerts/check-portfolio          # Check alerts on portfolio
```

---

## 🎨 Frontend Pages

### 1. **Home** (`/`)
- Introduction and feature overview
- Links to generator and dashboard
- Risk preference guidance

### 2. **Login** (`/login`)
- Email and password input
- Registration link
- JWT token storage on success

### 3. **Register** (`/register`)
- New user account creation
- Email validation
- Password strength requirements

### 4. **Dashboard** (`/dashboard`)
- Portfolio overview with Recharts visualizations
- Performance metrics
- Risk summary
- Quick navigation to other features

### 5. **Generator** (`/generator`)
- Investment amount input
- Duration selection (3-60 months)
- Risk preference selector (Low/Moderate/High)
- Mode selection (Auto/Single/Multiple stocks)
- Real-time allocation display
- Expected return and risk metrics

### 6. **History** (`/history`)
- List of generated portfolios
- Filter by risk level and date
- View portfolio details
- Download/export option

### 7. **Performance** (`/performance`)
- Predicted vs Actual return comparison
- Performance summary metrics
- Bar charts showing accuracy over time
- Detailed performance table

### 8. **Alerts** (`/alerts`)
- Active and resolved alerts list
- Filter by status
- Price drop notifications
- Target price achieved notifications

### 9. **Models** (`/models`)
- Side-by-side model comparison
- CAPM formula and results
- Markowitz metrics (volatility, Sharpe ratio)
- RAMENS recommendation
- Pros/cons for each model
- Visual comparison charts

---

## 🔍 Explainable AI (XAI)

Each portfolio recommendation includes:

### Factor Breakdown
```
{
  "ticker": "TCS.NS",
  "factor_breakdown": {
    "momentum": 35.2,
    "fundamentals": 28.5,
    "inverse_beta": 22.1,
    "factor_blend": 10.0,
    "macro": 4.2
  },
  "rationale": "Selected due to strong fundamentals and consistent momentum..."
}
```

### Stock Explanation Panel
- **Rationale**: Natural language explanation of selection
- **Factor Contribution**: Bar chart showing factor weights
- **Confidence Score**: High/Medium/Low confidence level
- **Key Insights**: Summary of why this stock was chosen

---

## 📊 Performance Tracking

### Workflow
1. User generates and saves a portfolio
2. System records **predicted return** (from RAMENS)
3. After time period: System fetches **current prices**
4. Calculates **actual return** based on current prices
5. Computes **accuracy** (difference between predicted and actual)
6. User can see comparison on Performance page

### Metrics
- **Predicted Return**: Expected growth % from RAMENS
- **Actual Return**: Real growth % based on current prices
- **Accuracy**: How close prediction was to actual (%)
- **Average Accuracy**: Mean accuracy across all tracked portfolios

---

## 🔄 Backtesting

### Features
- Simulate historical performance (1-5 years)
- Compare portfolio returns vs S&P 500 equivalent
- Show volatility and max drawdown
- Calculate annualized returns
- Provide Sharpe ratio

### Example
```json
{
  "initial_value": 50000,
  "final_value": 67500,
  "total_return_pct": 35.0,
  "annualized_return_pct": 17.5,
  "max_drawdown_pct": 12.3,
  "sharpe_ratio": 1.45,
  "growth_curve": [...]
}
```

---

## 🚨 Alert System

### Types of Alerts

#### 1. Price Drop Alert
- **Trigger**: Stock price drops >10% (configurable)
- **Status**: ACTIVE until resolved
- **Data**: Original price, current price, drop %

#### 2. Target Price Alert
- **Trigger**: Stock reaches or exceeds target price
- **Status**: RESOLVED when triggered
- **Data**: Target price, current price

### Alert Management
- View active alerts on Alerts page
- Filter by status (Active/Resolved)
- Acknowledge alerts
- Delete alerts

---

## 🎯 Model Comparison

### CAPM (Capital Asset Pricing Model)
- **Formula**: Expected Return = Rf + β(Rm - Rf)
- **Pros**: Simple, widely used, incorporates market risk
- **Cons**: Single risk factor, assumes linearity

### Markowitz Modern Portfolio Theory
- **Formula**: Optimize portfolio for best return/risk ratio
- **Pros**: Considers correlations, optimal allocation
- **Cons**: Requires accurate covariance matrix, complex

### RAMENS (Recommended)
- **Formula**: Weighted ensemble of 5 factors
- **Pros**: Explainable, adaptive, multi-factor, sector-aware
- **Cons**: More complex, requires quality data

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.9+ (backend)
- pip or conda (package manager)

### Installation

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend Setup
```bash
npm install
```

### Running Locally

#### Start Backend
```bash
# Development
npm run backend:dev

# Production
npm run backend:start
```

#### Start Frontend
```bash
# Development
npm run dev

# Production
npm run build && npm run start
```

#### Access
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📁 CSV File Formats

### users.csv
```
Email,Name,PasswordHash,CreatedAt
user@example.com,John Doe,<bcrypt_hash>,2024-01-15T10:30:00Z
```

### portfolios.csv
```
Email,Risk,Investment,Stocks,ExpectedReturn,Date
user@example.com,moderate,50000.00,"[{...}]",15.5,2024-01-15T10:30:00Z
```

### tracking.csv
```
Email,PortfolioID,PredictedReturn,ActualReturn,Accuracy,CreatedAt,CheckedAt
user@example.com,2024-01-15,15.5,14.2,91.5,2024-01-15T10:30:00Z,2024-02-15T10:30:00Z
```

### alerts.csv
```
Email,AlertID,AlertType,Ticker,TriggerValue,CurrentValue,Message,Status,CreatedAt,ResolvedAt
user@example.com,2024-01-15T10:30:00Z,PRICE_DROP,TCS.NS,10.0,12.5,"...",ACTIVE,2024-01-15T10:30:00Z,
```

---

## ⚠️ Important Disclaimers

**This system is for educational and simulation purposes only. It is NOT financial advice.**

- ✋ AI-based simulations are not guaranteed
- ⏰ Past performance does not indicate future results
- 💰 Always consult a certified financial advisor before investing
- 🔍 Verify all data on official market sources
- ⚡ Real market conditions may differ significantly from simulations

---

## 🔬 Testing

### Test Backend Module
```bash
python -c "from backend.ramens import generate_ramens_portfolio; print('OK')"
```

### Test Frontend Build
```bash
npm run build
```

### Test API
```bash
curl -X GET http://localhost:8000/health
```

---

## 🤝 Contributing

To extend INTELLiINVEST:

1. **Add new factors**: Update `backend/ramens.py`
2. **New models**: Create `backend/new_model.py` and integrate
3. **Frontend pages**: Create in `src/app/new-feature/`
4. **Components**: Add reusable components in `src/components/`

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review API documentation at `/docs`
3. Check error logs in browser console and server terminal

---

## 🎉 Version History

### v2.0.0 (Current)
- ✅ RAMENS algorithm with multi-factor scoring
- ✅ Explainable AI with factor breakdown
- ✅ Performance tracking (predicted vs actual)
- ✅ Backtesting module
- ✅ Model comparison (CAPM, Markowitz, RAMENS)
- ✅ Real-time alert system
- ✅ Yahoo Finance integration
- ✅ Production-grade frontend with Recharts
- ✅ JWT authentication
- ✅ CSV-based storage

### v1.0.0 (Previous)
- Basic portfolio generation
- User authentication
- Portfolio history storage

---

**Built with ❤️ for financial education and exploration.**
