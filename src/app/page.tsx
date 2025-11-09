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

  const handleGeneratePortfolio = async (params: InvestmentParams) => {
    setLoading(true)
    try {
      let livePrices: Record<string, number> | undefined = undefined

      // Use live data if enabled via env
      if (process.env.NEXT_PUBLIC_USE_LIVE_DATA === 'true') {
        try {
          const tickers = ALL_TICKERS
          const qs = encodeURIComponent(tickers.join(','))
          const resp = await fetch(`/api/quotes?tickers=${qs}`, { cache: 'no-store' })
          if (resp.ok) {
            const data = await resp.json()
            livePrices = data?.prices
          }
        } catch (e) {
          // silently fallback to static data
          console.warn('Live quote fetch failed, using static prices')
        }
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
    <main className="container mx-auto px-4 py-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
            AI Financial Advisor
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Get data-driven portfolio recommendations for the Indian stock market with 
            risk-adjusted returns tailored to your investment goals
          </p>
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

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Disclaimer:</strong> This is an AI-based simulation and not financial advice. 
                Please consult with a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
