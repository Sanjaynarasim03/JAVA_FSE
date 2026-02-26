/**
 * Top Stocks Data Loader
 * 
 * Client-side utility for loading top stocks data.
 * This is a static import of the top stocks configuration.
 */

import topStocksConfig from '../../.data/top-stocks.json'

export interface TopStock {
  ticker: string
  company: string
  price: number
  sector: string
  updateDate: string
}

export interface TopStocksConfig {
  lastUpdated: string
  stocks: TopStock[]
}

export function getTopStocksData(): TopStocksConfig {
  return topStocksConfig as TopStocksConfig
}

export function getTopStockTickers(): string[] {
  const config = getTopStocksData()
  return config.stocks.map((stock) => stock.ticker)
}

export function getTopStockPrices(): Record<string, number> {
  const config = getTopStocksData()
  return config.stocks.reduce(
    (acc, stock) => {
      acc[stock.ticker] = stock.price
      return acc
    },
    {} as Record<string, number>
  )
}

export function getAllTopStocks(): TopStock[] {
  const config = getTopStocksData()
  return config.stocks
}
