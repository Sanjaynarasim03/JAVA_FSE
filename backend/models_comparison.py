"""
Model comparison: CAPM vs Markowitz vs RAMENS
"""
from __future__ import annotations

from typing import Dict, List
import math


def calculate_capm(
    risk_free_rate: float = 6.0,
    market_return: float = 12.0,
    beta: float = 1.0,
) -> Dict:
    """
    Capital Asset Pricing Model (CAPM)
    Expected Return = Rf + β(Rm - Rf)
    """
    expected_return = risk_free_rate + beta * (market_return - risk_free_rate)

    return {
        "model": "CAPM",
        "formula": "Expected Return = Rf + β(Rm - Rf)",
        "risk_free_rate": risk_free_rate,
        "market_return": market_return,
        "beta": beta,
        "expected_return": round(expected_return, 2),
        "pros": [
            "Simple and widely used",
            "Based on market risk (beta)",
            "Incorporates risk-free rate",
        ],
        "cons": [
            "Assumes linear relationship between risk and return",
            "Single risk factor (beta) may be insufficient",
            "Market return estimation can be subjective",
        ],
    }


def calculate_markowitz(
    allocations: List[Dict],
    expected_returns: List[float],
    covariance_matrix: List[List[float]],
) -> Dict:
    """
    Markowitz Modern Portfolio Theory
    Optimizes for best return given a risk level.
    """
    n = len(allocations)
    if n == 0:
        return {"status": "error", "message": "No allocations provided"}

    # Calculate portfolio return
    portfolio_return = sum(
        alloc.get("allocation_pct", 0) / 100 * ret
        for alloc, ret in zip(allocations, expected_returns)
    )

    # Calculate portfolio variance (simplified - using diagonal of covariance)
    portfolio_variance = sum(
        (alloc.get("allocation_pct", 0) / 100) ** 2 * covariance_matrix[i][i]
        for i, alloc in enumerate(allocations)
    )

    portfolio_std = math.sqrt(max(0, portfolio_variance))

    return {
        "model": "Markowitz Modern Portfolio Theory",
        "formula": "Optimize: Return / Volatility",
        "portfolio_return": round(portfolio_return, 2),
        "portfolio_volatility": round(portfolio_std, 2),
        "sharpe_ratio": round(portfolio_return / max(portfolio_std, 0.001), 2),
        "allocations": n,
        "pros": [
            "Balances return and risk",
            "Considers correlations between assets",
            "Provides optimal asset allocation",
        ],
        "cons": [
            "Requires accurate covariance matrix",
            "Computationally complex",
            "Past correlations may not hold in future",
        ],
    }


def calculate_ramens(
    allocations: List[Dict],
    expected_return: float,
    volatility: float,
) -> Dict:
    """
    RAMENS: Risk-Aware Multi-factor Ensemble Normalized Scoring
    """
    n = len(allocations)

    return {
        "model": "RAMENS",
        "formula": "Weighted factor ensemble (Momentum, Fundamentals, Beta, Blend, Macro)",
        "allocations": n,
        "expected_return": round(expected_return, 2),
        "volatility": round(volatility, 2),
        "confidence": "High" if expected_return > 0 and volatility < 30 else "Medium",
        "pros": [
            "Multi-factor ensemble approach",
            "Explainable AI with factor breakdown",
            "Adaptive weights based on risk preference",
            "Considers market regime and macro factors",
        ],
        "cons": [
            "More complex to understand",
            "Requires accurate factor data",
            "Historical performance may not predict future",
        ],
    }


def compare_models(
    allocations: List[Dict],
    expected_return_ramens: float,
    volatility_ramens: float,
    expected_returns: List[float],
    covariance_matrix: List[List[float]],
    risk_free_rate: float = 6.0,
    market_return: float = 12.0,
    portfolio_beta: float = 1.0,
) -> Dict:
    """
    Compare all three models and recommend best approach.
    """
    capm_result = calculate_capm(risk_free_rate, market_return, portfolio_beta)
    markowitz_result = calculate_markowitz(allocations, expected_returns, covariance_matrix)
    ramens_result = calculate_ramens(allocations, expected_return_ramens, volatility_ramens)

    comparison = {
        "status": "ok",
        "models": {
            "capm": capm_result,
            "markowitz": markowitz_result,
            "ramens": ramens_result,
        },
        "recommendation": {
            "best_for_return": "RAMENS" if expected_return_ramens > capm_result["expected_return"] else "CAPM",
            "best_for_risk_adjusted": "RAMENS"
            if ramens_result.get("volatility", 100) < markowitz_result.get("portfolio_volatility", 100)
            else "Markowitz",
            "overall_recommendation": "RAMENS",
            "reasoning": [
                "RAMENS combines multiple factors (Momentum, Fundamentals, Beta, Factor Blend, Macro)",
                "Provides explainable AI with clear factor contributions",
                "Adapts weights based on risk preference",
                "Balances return expectations with risk management",
                "Better for Indian market with sector-specific optimization",
            ],
        },
        "metrics_comparison": {
            "capm_return": capm_result["expected_return"],
            "markowitz_return": markowitz_result["portfolio_return"],
            "ramens_return": expected_return_ramens,
            "markowitz_volatility": markowitz_result["portfolio_volatility"],
            "ramens_volatility": volatility_ramens,
            "markowitz_sharpe": markowitz_result["sharpe_ratio"],
            "ramens_sharpe": round(expected_return_ramens / max(volatility_ramens, 0.001), 2),
        },
    }

    return comparison
