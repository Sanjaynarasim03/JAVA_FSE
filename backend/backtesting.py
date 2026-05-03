"""
Backtesting module for simulating historical portfolio performance.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List

from backend.finance_data import get_historical_data


def backtest_portfolio(
    allocations: List[Dict],
    investment_amount: float,
    days_back: int = 365,
) -> Dict:
    """
    Backtest a portfolio over historical data.
    
    Args:
        allocations: List of {"ticker": str, "allocation_pct": float}
        investment_amount: Initial investment in INR
        days_back: Number of days to look back (default 1 year)
    
    Returns:
        Dictionary with backtest results including growth curve and metrics
    """
    # Get historical data for all tickers
    historical_data = {}
    for alloc in allocations:
        ticker = alloc.get("ticker", "")
        if ticker:
            historical_data[ticker] = get_historical_data(ticker, days=days_back)

    if not historical_data:
        return {"status": "error", "message": "No valid tickers provided"}

    # Get date range
    all_dates = set()
    for ticker_data in historical_data.values():
        all_dates.update(ticker_data.keys())

    sorted_dates = sorted(all_dates)
    if not sorted_dates:
        return {"status": "error", "message": "No historical data available"}

    # Initialize portfolio value tracking
    portfolio_values = []
    growth_curve = []

    for date_str in sorted_dates:
        portfolio_value = 0.0
        for alloc in allocations:
            ticker = alloc.get("ticker", "")
            alloc_pct = alloc.get("allocation_pct", 0) / 100
            ticker_historical = historical_data.get(ticker, {})

            if date_str in ticker_historical:
                price = ticker_historical[date_str]
                shares = (investment_amount * alloc_pct) / price if price > 0 else 0
                portfolio_value += shares * price

        portfolio_values.append(portfolio_value)
        growth_pct = ((portfolio_value - investment_amount) / investment_amount) * 100
        growth_curve.append({
            "date": date_str,
            "value": round(portfolio_value, 2),
            "growth_pct": round(growth_pct, 2),
        })

    # Calculate metrics
    if not portfolio_values:
        return {"status": "error", "message": "Could not calculate portfolio values"}

    final_value = portfolio_values[-1]
    initial_value = investment_amount
    total_return = ((final_value - initial_value) / initial_value) * 100 if initial_value > 0 else 0

    # Calculate volatility (standard deviation of daily returns)
    daily_returns = []
    for i in range(1, len(portfolio_values)):
        if portfolio_values[i - 1] > 0:
            ret = ((portfolio_values[i] - portfolio_values[i - 1]) / portfolio_values[i - 1]) * 100
            daily_returns.append(ret)

    volatility = 0.0
    if daily_returns:
        mean_ret = sum(daily_returns) / len(daily_returns)
        variance = sum((r - mean_ret) ** 2 for r in daily_returns) / len(daily_returns)
        volatility = variance ** 0.5

    # Calculate max drawdown
    max_value = initial_value
    max_drawdown = 0.0
    for value in portfolio_values:
        if value > max_value:
            max_value = value
        drawdown = ((max_value - value) / max_value) * 100 if max_value > 0 else 0
        if drawdown > max_drawdown:
            max_drawdown = drawdown

    # Annualized metrics
    days_in_backtest = len(sorted_dates)
    annualized_return = total_return * (365 / max(days_in_backtest, 1))
    annualized_volatility = volatility * (252 ** 0.5)  # 252 trading days per year
    sharpe_ratio = annualized_return / max(annualized_volatility, 0.001) if annualized_volatility > 0 else 0

    return {
        "status": "ok",
        "backtest_period_days": days_in_backtest,
        "initial_value": round(initial_value, 2),
        "final_value": round(final_value, 2),
        "total_return_pct": round(total_return, 2),
        "annualized_return_pct": round(annualized_return, 2),
        "volatility_pct": round(volatility, 2),
        "annualized_volatility_pct": round(annualized_volatility, 2),
        "max_drawdown_pct": round(max_drawdown, 2),
        "sharpe_ratio": round(sharpe_ratio, 2),
        "growth_curve": growth_curve[-30:] if len(growth_curve) > 30 else growth_curve,  # Last 30 days
    }


def compare_backtest_results(
    allocations1: List[Dict],
    allocations2: List[Dict],
    investment_amount: float,
    days_back: int = 365,
) -> Dict:
    """
    Compare backtesting results of two portfolios.
    """
    result1 = backtest_portfolio(allocations1, investment_amount, days_back)
    result2 = backtest_portfolio(allocations2, investment_amount, days_back)

    if result1.get("status") == "error" or result2.get("status") == "error":
        return {"status": "error", "message": "Could not backtest one or both portfolios"}

    return {
        "status": "ok",
        "portfolio1": result1,
        "portfolio2": result2,
        "better_performer": "portfolio1" if result1.get("total_return_pct", 0) > result2.get("total_return_pct", 0) else "portfolio2",
        "return_difference": round(
            (result1.get("total_return_pct", 0) - result2.get("total_return_pct", 0)), 2
        ),
    }
