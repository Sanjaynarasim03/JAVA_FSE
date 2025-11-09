'use client'

import { useState } from 'react'
import type { InvestmentParams } from '../types/portfolio'

interface InvestmentFormProps {
  onSubmit: (params: InvestmentParams) => void
  loading: boolean
}

export default function InvestmentForm({ onSubmit, loading }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentParams>({
    investment_amount: 100000,
    duration_months: 12,
    risk_preference: 'moderate',
    mode: 'auto',
    preferred_tickers: []
  })

  const [customTickers, setCustomTickers] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = {
      ...formData,
      preferred_tickers: customTickers.trim() ? 
        customTickers.split(',').map(t => t.trim().toUpperCase()) : 
        undefined
    }
    
    onSubmit(params)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setFormData(prev => ({ ...prev, investment_amount: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Parameters</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Investment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              min="10000"
              max="10000000"
              step="1000"
              value={formData.investment_amount}
              onChange={handleAmountChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100000"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum: ₹10,000 | Maximum: ₹1,00,00,000</p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Duration
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { months: 3, label: '3 Months' },
              { months: 6, label: '6 Months' },
              { months: 12, label: '1 Year' }
            ].map((duration) => (
              <button
                key={duration.months}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, duration_months: duration.months as any }))}
                className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                  formData.duration_months === duration.months
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { months: 24, label: '2 Years' },
              { months: 36, label: '3 Years' },
              { months: 60, label: '5 Years' }
            ].map((duration) => (
              <button
                key={duration.months}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, duration_months: duration.months as any }))}
                className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                  formData.duration_months === duration.months
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Select your investment horizon for optimized recommendations</p>
        </div>

        {/* Risk Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Preference
          </label>
          <div className="space-y-2">
            {[
              { value: 'low', label: 'Low Risk', desc: 'Conservative, blue-chip stocks' },
              { value: 'moderate', label: 'Moderate Risk', desc: 'Balanced growth & defensive mix' },
              { value: 'high', label: 'High Risk', desc: 'Growth-focused, higher volatility' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="risk_preference"
                  value={option.value}
                  checked={formData.risk_preference === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, risk_preference: e.target.value as any }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Selection Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Selection Mode
          </label>
          <select
            value={formData.mode}
            onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as any }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="auto">Auto (2-5 stocks)</option>
            <option value="single">Single Stock</option>
            <option value="multiple">Multiple Stocks (3-7)</option>
          </select>
        </div>

        {/* Preferred Tickers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Stocks (Optional)
          </label>
          <input
            type="text"
            value={customTickers}
            onChange={(e) => setCustomTickers(e.target.value)}
            placeholder="TCS.NS, RELIANCE.NS, INFY.NS"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter NSE tickers separated by commas (e.g., TCS.NS, RELIANCE.NS)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Portfolio...
            </div>
          ) : (
            'Generate AI Portfolio'
          )}
        </button>
      </form>
    </div>
  )
}
