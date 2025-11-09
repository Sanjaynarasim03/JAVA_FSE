# AI Financial Advisor - Indian Stock Market

A sophisticated AI-powered financial advisor application designed specifically for the Indian stock market. This application provides data-driven portfolio recommendations with risk-adjusted returns tailored to individual investment goals.

## 🚀 Features

- **Intelligent Portfolio Generation**: AI-driven stock selection based on investment amount, duration, and risk preference
- **Indian Market Focus**: Supports NSE/BSE listed stocks with proper ticker formats (e.g., TCS.NS, RELIANCE.NS)
- **Risk-Based Allocation**: Three risk levels (Low, Moderate, High) with sector-wise allocation strategies
- **Multiple Selection Modes**: Auto, Single Stock, or Multiple Stock selection
- **Real-time Calculations**: Expected returns, share quantities, and portfolio valuations
- **Comprehensive Analysis**: Detailed rationale for each stock selection
- **Modern UI**: Responsive design with beautiful visualizations
- **Machine-Readable Output**: JSON format for integration with other systems

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (ready for future implementation)
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS, Autoprefixer

## 📊 Investment Logic

### Risk-Based Allocation
- **Low Risk**: Focus on defensive sectors (FMCG, Pharma, Banking) with stable, large-cap stocks
- **Moderate Risk**: Balanced mix of growth and defensive stocks across IT, Banking, Auto, FMCG
- **High Risk**: Growth-focused allocation with higher concentration in cyclical sectors

### Stock Selection Algorithm
The AI considers multiple factors:
- PE ratio and valuation metrics
- Dividend yield
- Beta (volatility measure)
- Market capitalization
- Sector momentum
- Risk-adjusted scoring

## 🎯 Usage

1. **Set Investment Parameters**:
   - Investment amount (₹10,000 - ₹1,00,00,000)
   - Duration (3 or 6 months)
   - Risk preference (Low/Moderate/High)
   - Selection mode (Auto/Single/Multiple)
   - Optional: Preferred stock tickers

2. **Get AI Recommendations**:
   - Detailed portfolio allocation
   - Expected returns and growth projections
   - Risk assessment and confidence levels
   - Investment rationale for each stock

3. **Review Results**:
   - Portfolio summary with key metrics
   - Stock-wise allocation table
   - Investment rationale and recommendations
   - Machine-readable JSON output

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-financial-advisor
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Enable live market data from Yahoo Finance:

Create `.env.local` in the project root and add:

```bash
NEXT_PUBLIC_USE_LIVE_DATA=true
```

Then restart the dev server.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
│   ├── InvestmentForm.tsx
│   └── PortfolioResults.tsx
├── lib/                 # Utilities and logic
│   ├── marketData.ts   # Stock data and constants
│   └── portfolioGenerator.ts # Core algorithm
└── types/              # TypeScript type definitions
    └── portfolio.ts
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configurations:
```bash
# Frontend base URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Use Yahoo Finance for live quotes (optional)
NEXT_PUBLIC_USE_LIVE_DATA=true
```

### Customization
- **Stock Data**: Update `src/lib/marketData.ts` with real-time data sources
- **Live Quotes**: The app can fetch live prices via Yahoo Finance (`/api/quotes`). If a quote isn't available, it gracefully falls back to values in `marketData.ts`.
- **Algorithm**: Modify `src/lib/portfolioGenerator.ts` for different allocation strategies
- **UI Theme**: Customize colors and styling in `tailwind.config.js`

## 🎨 Key Components

### InvestmentForm
- User input collection
- Form validation
- Parameter configuration

### PortfolioResults  
- Portfolio visualization
- Detailed allocation tables
- Investment rationale display
- JSON output formatting

### portfolioGenerator
- Core AI algorithm
- Risk-based stock selection
- Expected return calculations
- Portfolio optimization

## 📈 Sample Output

```json
{
  "investment_amount_inr": 100000,
  "duration_months": 6,
  "risk_preference": "moderate",
  "allocations": [
    {
      "rank": 1,
      "company": "Tata Consultancy Services",
      "ticker": "TCS.NS",
      "allocation_inr": 25000,
      "shares": 6,
      "entry_price_inr": 3890,
      "expected_return_pct": 12.5,
      "expected_value_inr": 28125,
      "risk": "Low",
      "rationale": "Strong fundamentals with attractive valuation and export growth potential."
    }
  ],
  "total_expected_value_inr": 112500,
  "expected_growth_pct": 12.5,
  "confidence": "High",
  "notes": "Moderate risk portfolio with balanced growth across sectors."
}
```

## ⚠️ Disclaimer

**This is an AI-based simulation and not financial advice.** The recommendations are based on historical data and algorithmic analysis. Always consult with a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Real-time stock data integration
- [ ] Advanced charting and visualizations  
- [ ] Portfolio backtesting capabilities
- [ ] Risk metrics and Monte Carlo simulations
- [ ] Export to Excel/PDF functionality
- [ ] User accounts and portfolio tracking
- [ ] Technical analysis indicators
- [ ] News sentiment analysis integration

---


