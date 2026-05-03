import { NextRequest, NextResponse } from 'next/server'
import { generateAdvancedPortfolio, AdvancedInvestmentParams } from '@/lib/advancedPortfolioGenerator'
import { fetchQuotes } from '@/lib/liveMarket'
import { TOP_LIQUID_TICKERS } from '@/lib/marketData'
import { getTopStockTickers } from '@/lib/topStocksData'

/**
 * POST /api/advanced-portfolio
 * 
 * Advanced quantitative portfolio generation endpoint
 * Returns finance-grade JSON with ensemble scoring, risk metrics, and backtesting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const params: AdvancedInvestmentParams = {
      investment_amount_inr: body.investment_amount_inr,
      duration_months: body.duration_months,
      risk_preference: body.risk_preference,
      mode: body.mode,
      preferred_tickers: body.preferred_tickers,
      latest_prices: body.latest_prices,
      rfr_annual_pct: body.rfr_annual_pct
    }

    const autoModeTopTickers =
      params.mode === 'auto' && (!params.preferred_tickers || params.preferred_tickers.length === 0)
        ? getTopStockTickers()
        : undefined

    const resolvedParams: AdvancedInvestmentParams = {
      ...params,
      preferred_tickers: autoModeTopTickers ?? params.preferred_tickers,
    }

    // Attempt to fetch live Yahoo Finance prices if not provided
    let livePrices = resolvedParams.latest_prices
    
    if (!livePrices || Object.keys(livePrices).length === 0) {
      try {
        const tickersToFetch =
          resolvedParams.preferred_tickers && resolvedParams.preferred_tickers.length > 0
            ? resolvedParams.preferred_tickers
            : TOP_LIQUID_TICKERS.slice(0, 20)

        livePrices = await fetchQuotes(tickersToFetch)
      } catch (error) {
        console.warn('Failed to fetch live prices, using fallback data:', error)
        // Will use fallback prices from MARKET_DATA
      }
    }

    // Generate portfolio with live or fallback prices
    const portfolio = generateAdvancedPortfolio({
      ...resolvedParams,
      latest_prices: livePrices
    })

    return NextResponse.json(portfolio, {
      status: portfolio.status === 'ok' ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error: any) {
    console.error('Advanced portfolio generation error:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error during portfolio generation',
        investment_amount_inr: 0,
        duration_months: 12,
        risk_preference: 'moderate',
        mode: 'auto',
        model_metadata: {
          model_type: 'Lightweight-ensemble',
          model_version: 'v2.1.0',
          generation_timestamp: new Date().toISOString(),
          model_confidence_score: 'Low',
          ensemble_weights: { momentum: 0, fundamental: 0, volatility: 0, regression: 0, macro: 0 }
        },
        allocations: [],
        total_expected_value_inr: 0,
        expected_growth_pct: 0,
        predicted_annualized_return_pct: 0,
        predicted_portfolio_volatility_pct: 0,
        predicted_sharpe_ratio: 0,
        predicted_max_drawdown_pct: 0,
        unallocated_cash_inr: 0,
        estimated_transaction_cost_inr: 0,
        backtest_summary: {
          backtest_possible: false,
          periods_tested: [],
          realized_annualized_return_pct: null,
          realized_sharpe_ratio: null,
          realized_max_drawdown_pct: null,
          avg_annual_turnover_pct: null
        },
        notes: 'System error prevented portfolio generation.',
        disclaimer: 'This is an AI-based financial simulation and not financial advice.'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/advanced-portfolio
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/advanced-portfolio',
    method: 'POST',
    description: 'Advanced quantitative portfolio generator with ensemble modeling, risk metrics, and backtesting',
    request_schema: {
      investment_amount_inr: 'number (10-1000000)',
      duration_months: 'number (3, 6, 12, 24, 36, 48, or 60)',
      risk_preference: 'string (low | moderate | high)',
      mode: 'string (auto | single | multiple)',
      preferred_tickers: 'string[] (optional, e.g., ["TCS.NS", "RELIANCE.NS"])',
      latest_prices: 'Record<string, number> (optional, e.g., {"TCS.NS": 3850})',
      rfr_annual_pct: 'number (optional, default: 6.5)'
    },
    response_features: [
      'Ensemble scoring (momentum, fundamental, volatility, regression, macro)',
      'Risk-adjusted allocations with Sharpe ratio and max drawdown',
      'Backtesting summary with realized returns',
      'Transaction cost estimates',
      'Model confidence scoring',
      'Finance-grade JSON output'
    ],
    example_request: {
      investment_amount_inr: 50000,
      duration_months: 36,
      risk_preference: 'moderate',
      mode: 'auto',
      preferred_tickers: ['TCS.NS', 'RELIANCE.NS'],
      rfr_annual_pct: 6.5
    }
  })
}
