'use client'

import { useState } from 'react'
import InvestmentForm from '../components/InvestmentForm'
import PortfolioResults from '../components/PortfolioResults'
import { generatePortfolio } from '../lib/portfolioGenerator'
import { ALL_TICKERS } from '../lib/marketData'
import type { InvestmentParams, PortfolioAllocation } from '../types/portfolio'

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioAllocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [usingLiveData, setUsingLiveData] = useState(false)

  const handleGeneratePortfolio = async (params: InvestmentParams) => {
    setLoading(true)
    setUsingLiveData(false)
    try {
      let livePrices: Record<string, number> | undefined = undefined

      // Always try to fetch live data from Yahoo Finance
      try {
        const tickers = ALL_TICKERS
        const qs = encodeURIComponent(tickers.join(','))
        const resp = await fetch(`/api/quotes?tickers=${qs}`, { cache: 'no-store' })
        if (resp.ok) {
          const data = await resp.json()
          livePrices = data?.prices
          if (livePrices && Object.keys(livePrices).length > 0) {
            setUsingLiveData(true)
            console.log('✅ Using live Yahoo Finance prices')
          }
        }
      } catch (e) {
        console.warn('⚠️ Live quote fetch failed, using fallback prices')
      }

      const result = generatePortfolio(params, livePrices)
      setPortfolio(result)
    } catch (error) {
      console.error('Error generating portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              INTELLiINVEST
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              AI-powered portfolio recommendations for the Indian stock market with 
              real-time data and risk-adjusted projections
            </p>
          {usingLiveData && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Market Data Active
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <InvestmentForm 
              onSubmit={handleGeneratePortfolio}
              loading={loading}
            />
          </div>

          {/* Results */}
          <div>
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing market data and generating your portfolio...</p>
                </div>
              </div>
            ) : portfolio ? (
              <PortfolioResults portfolio={portfolio} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <p className="text-gray-600">Enter your investment parameters to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Comprehensive Disclaimer */}
        <div className="mt-12 space-y-4">
          <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ Investment Risk Disclaimer</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  <strong>This is an AI-based simulation tool for educational purposes only.</strong> It is NOT financial advice, investment recommendation, or a solicitation to buy/sell securities.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li><strong>Projections are estimates</strong> - Expected returns are algorithmic projections based on historical patterns and fundamentals, not guaranteed future performance</li>
                  <li><strong>Market risk exists</strong> - Stock prices can fall as well as rise. You may lose some or all of your invested capital</li>
                  <li><strong>Past performance ≠ future results</strong> - Historical returns do not guarantee similar future outcomes</li>
                  <li><strong>Not SEBI registered</strong> - This tool is not registered with SEBI or any regulatory authority</li>
                  <li><strong>Consult professionals</strong> - Always consult a qualified, registered financial advisor before making investment decisions</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* How This Works Info Section - Explains the algorithm methodology */}
          {/* <div className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-blue-800 mb-2">ℹ️ How This Works</h3>
                <p className="text-sm text-blue-700">
                  Our algorithm analyzes stocks using multiple factors including PE ratios, dividend yields, beta (volatility), 
                  market capitalization, and sector trends. {usingLiveData ? 'Live prices are fetched from Yahoo Finance.' : 'Using cached price data.'} 
                  Returns are projected using historical patterns and fundamental analysis, then adjusted for your risk preference and investment horizon.
                </p>
              </div>
            </div>
          </div> */}
        </div>
        </div>
      </div>
    </main>
  )
}
