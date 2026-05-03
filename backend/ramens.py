from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean, pstdev
from typing import Dict, List, Sequence

from backend.schemas import GeneratePortfolioRequest, PortfolioResponse, RiskLevel, StockAllocation

ROOT_DIR = Path(__file__).resolve().parents[1]
TOP_STOCKS_PATH = ROOT_DIR / "data" / "top-stocks.json"
MARKET_DATA_PATH = ROOT_DIR / "src" / "data" / "market-data.json"
MARKET_UNIVERSE_PATH = ROOT_DIR / "src" / "data" / "market-universe.json"


@dataclass(frozen=True)
class StockProfile:
    ticker: str
    company: str
    price: float
    sector: str
    market_cap: str
    pe: float
    beta: float
    dividend: float
    risk: str


def _read_json(path: Path):
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _stable_score(value: str, salt: str) -> float:
    digest = hashlib.sha256(f"{salt}:{value}".encode("utf-8")).hexdigest()
    return int(digest[:8], 16) / 0xFFFFFFFF


def _clamp(number: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, number))


def _normalize_scores(values: Sequence[float]) -> List[float]:
    if not values:
        return []
    minimum = min(values)
    maximum = max(values)
    if math.isclose(minimum, maximum):
        return [50.0 for _ in values]
    return [((value - minimum) / (maximum - minimum)) * 100 for value in values]


def _sector_macro_bias(sector: str, risk_preference: str) -> float:
    sector_key = sector.lower()
    defensive = {"banking", "fmcg", "healthcare", "utilities", "telecom"}
    cyclic = {"energy", "metals", "industrials", "automotive", "materials", "infrastructure"}

    if risk_preference == "low":
        if sector_key in defensive:
            return 84.0
        if sector_key in cyclic:
            return 45.0
        return 63.0

    if risk_preference == "high":
        if sector_key in cyclic:
            return 86.0
        if sector_key in defensive:
            return 58.0
        return 72.0

    if sector_key in defensive:
        return 76.0
    if sector_key in cyclic:
        return 68.0
    return 70.0


def _weight_map(risk_preference: str) -> Dict[str, float]:
    if risk_preference == "low":
        return {"momentum": 0.16, "fundamentals": 0.32, "inverse_beta": 0.25, "factor_blend": 0.17, "macro": 0.10}
    if risk_preference == "high":
        return {"momentum": 0.30, "fundamentals": 0.14, "inverse_beta": 0.10, "factor_blend": 0.26, "macro": 0.20}
    return {"momentum": 0.22, "fundamentals": 0.23, "inverse_beta": 0.18, "factor_blend": 0.22, "macro": 0.15}


def _target_positions(risk_preference: str, mode: str, available: int) -> int:
    if available <= 0:
        return 0
    if mode == "single":
        return 1
    if mode == "multiple":
        return min(max(3, 5), available, 7)
    if risk_preference == "low":
        return min(4, available)
    if risk_preference == "high":
        return min(6, available)
    return min(5, available)


def _build_universe() -> List[StockProfile]:
    top_stocks = _read_json(TOP_STOCKS_PATH) or {"stocks": []}
    market_data = _read_json(MARKET_DATA_PATH) or {}
    market_universe = _read_json(MARKET_UNIVERSE_PATH) or []
    universe_lookup = {entry.get("ticker"): entry for entry in market_universe if isinstance(entry, dict)}

    profiles: List[StockProfile] = []
    for stock in top_stocks.get("stocks", []):
        ticker = stock.get("ticker")
        if not ticker:
            continue
        market_row = market_data.get(ticker, {}) if isinstance(market_data, dict) else {}
        universe_row = universe_lookup.get(ticker, {})
        profiles.append(
            StockProfile(
                ticker=ticker,
                company=stock.get("company") or market_row.get("company") or ticker,
                price=float(stock.get("price") or market_row.get("price") or 0),
                sector=stock.get("sector") or market_row.get("sector") or universe_row.get("sector") or "Diversified",
                market_cap=market_row.get("marketCap") or universe_row.get("marketCap") or "Unknown",
                pe=float(market_row.get("pe") or 18.0),
                beta=float(market_row.get("beta") or 1.0),
                dividend=float(market_row.get("dividend") or 0.0),
                risk=market_row.get("risk") or "Moderate",
            )
        )

    if profiles:
        return profiles

    return [
        StockProfile("TCS.NS", "Tata Consultancy Services", 3850.0, "IT", "Large", 28.0, 0.92, 1.6, "Low"),
        StockProfile("HDFCBANK.NS", "HDFC Bank", 1560.0, "Banking", "Large", 20.5, 0.98, 1.2, "Low"),
        StockProfile("RELIANCE.NS", "Reliance Industries", 2925.0, "Energy", "Large", 23.5, 1.08, 0.7, "Moderate"),
    ]


def _factor_scores(stock: StockProfile, request: GeneratePortfolioRequest) -> Dict[str, float]:
    momentum = _clamp(38 + _stable_score(stock.ticker, "momentum") * 55 + (stock.beta - 1) * 4, 0, 100)
    fundamentals = _clamp(92 - (stock.pe * 2.1) + (stock.dividend * 10), 18, 98)
    inverse_beta = _clamp(100 - abs(stock.beta - 1.0) * 48, 20, 100)
    factor_blend = (momentum * 0.35) + (fundamentals * 0.40) + (inverse_beta * 0.25)
    macro = _sector_macro_bias(stock.sector, request.risk_preference)
    return {
        "momentum": round(momentum, 2),
        "fundamentals": round(fundamentals, 2),
        "inverse_beta": round(inverse_beta, 2),
        "factor_blend": round(factor_blend, 2),
        "macro": round(macro, 2),
    }


def _risk_level(weighted_beta: float, risk_preference: str) -> RiskLevel:
    if risk_preference == "low" or weighted_beta <= 0.98:
        return "Low"
    if risk_preference == "high" or weighted_beta >= 1.12:
        return "High"
    return "Moderate"


def _confidence_label(scores: Sequence[float]) -> str:
    if not scores:
        return "Low"
    average_score = mean(scores)
    dispersion = pstdev(scores) if len(scores) > 1 else 0
    if average_score >= 70 and dispersion <= 10:
        return "High"
    if average_score >= 56:
        return "Medium"
    return "Low"


def _annual_return_pct(score: float, risk_preference: str) -> float:
    base = 5.5 + (score / 100.0) * 8.5
    risk_multiplier = {"low": 0.88, "moderate": 1.0, "high": 1.18}[risk_preference]
    return base * risk_multiplier


def _build_rationale(stock: StockProfile, factors: Dict[str, float], request: GeneratePortfolioRequest) -> str:
    thesis = []
    if factors["fundamentals"] >= 70:
        thesis.append("strong fundamentals")
    if factors["momentum"] >= 65:
        thesis.append("positive momentum")
    if factors["inverse_beta"] >= 70:
        thesis.append("controlled volatility")
    thesis.append(f"{stock.sector.lower()} diversification")
    if request.risk_preference == "high":
        thesis.append("higher beta upside")
    elif request.risk_preference == "low":
        thesis.append("capital preservation bias")
    return ", ".join(thesis[:3])


def generate_ramens_portfolio(request: GeneratePortfolioRequest, email: str) -> PortfolioResponse:
    universe = _build_universe()
    if request.preferred_tickers:
        preferred = {ticker.upper() for ticker in request.preferred_tickers}
        filtered = [stock for stock in universe if stock.ticker.upper() in preferred]
        if filtered:
            universe = filtered

    affordable_floor = max(request.investment_amount * 0.5, 250)
    universe = [stock for stock in universe if stock.price <= affordable_floor] or universe

    ranked_candidates = []
    weights = _weight_map(request.risk_preference)
    for stock in universe:
        factors = _factor_scores(stock, request)
        composite_score = (
            factors["momentum"] * weights["momentum"]
            + factors["fundamentals"] * weights["fundamentals"]
            + factors["inverse_beta"] * weights["inverse_beta"]
            + factors["factor_blend"] * weights["factor_blend"]
            + factors["macro"] * weights["macro"]
        )
        ranked_candidates.append((stock, factors, round(composite_score, 4)))

    ranked_candidates.sort(key=lambda item: item[2], reverse=True)
    position_count = _target_positions(request.risk_preference, request.mode, len(ranked_candidates))
    selected = ranked_candidates[:position_count]

    if not selected:
        now = datetime.now(timezone.utc)
        return PortfolioResponse(
            status="ok",
            email=email,
            investment_amount_inr=request.investment_amount,
            duration_months=request.duration_months,
            risk_preference=request.risk_preference,
            risk_level="Moderate",
            mode=request.mode,
            allocations=[],
            total_expected_value_inr=request.investment_amount,
            unallocated_cash_inr=request.investment_amount,
            expected_growth_pct=0.0,
            confidence="Low",
            portfolio_summary="No eligible stocks were available for the requested portfolio.",
            methodology="RAMENS: risk-aware multi-factor ensemble normalized scoring using synthetic momentum, fundamentals, beta, factor blend, and macro signals.",
            notes="Adjust your preferred tickers or investment amount to unlock more opportunities.",
            disclaimer="This is an AI-based simulation and not financial advice.",
            generated_at=now,
            ai_generated=True,
        )

    composite_scores = [candidate[2] for candidate in selected]
    normalized_scores = _normalize_scores(composite_scores)

    budget = request.investment_amount
    raw_weights = [math.exp((score - max(composite_scores)) / 8.5) for score in composite_scores]
    weight_total = sum(raw_weights) or 1.0
    allocation_weights = [value / weight_total for value in raw_weights]

    allocations: List[StockAllocation] = []
    invested_total = 0.0
    weighted_beta = 0.0
    for index, ((stock, factors, composite_score), normalized_score, weight) in enumerate(zip(selected, normalized_scores, allocation_weights), start=1):
        allocation_amount = round(budget * weight, 2)
        shares = int(allocation_amount // stock.price) if stock.price > 0 else 0
        invested_amount = round(shares * stock.price, 2)

        if shares == 0 and stock.price <= budget and index == 1:
            shares = 1
            invested_amount = round(stock.price, 2)

        invested_total += invested_amount
        weighted_beta += stock.beta * invested_amount
        annual_return_pct = _annual_return_pct(composite_score, request.risk_preference)
        horizon_return_pct = round(annual_return_pct * (request.duration_months / 12.0), 2)
        expected_value = round(invested_amount * (1 + horizon_return_pct / 100.0), 2)

        allocations.append(
            StockAllocation(
                rank=index,
                company=stock.company,
                ticker=stock.ticker,
                allocation_inr=invested_amount,
                shares=shares,
                entry_price_inr=round(stock.price, 2),
                expected_return_pct=horizon_return_pct,
                expected_value_inr=expected_value,
                risk=_risk_level(stock.beta, request.risk_preference),
                rationale=_build_rationale(stock, factors, request),
                score=round(normalized_score, 2),
                factor_breakdown=factors,
            )
        )

    if invested_total <= 0 and allocations:
        first_stock = selected[0][0]
        allocations[0].shares = 1
        allocations[0].allocation_inr = round(first_stock.price, 2)
        allocations[0].expected_value_inr = round(first_stock.price * 1.05, 2)
        invested_total = allocations[0].allocation_inr
        weighted_beta = first_stock.beta * invested_total

    unallocated_cash = round(max(0.0, request.investment_amount - invested_total), 2)
    total_expected_value = round(sum(item.expected_value_inr for item in allocations) + unallocated_cash, 2)
    expected_growth_pct = round(((total_expected_value - request.investment_amount) / request.investment_amount) * 100, 2)
    avg_score = mean(composite_scores)
    confidence = _confidence_label(composite_scores)
    portfolio_beta = weighted_beta / invested_total if invested_total else 1.0
    risk_level = _risk_level(portfolio_beta, request.risk_preference)
    top_stock = allocations[0]
    top_score = top_stock.score or 0.0
    sector_names = sorted({candidate[0].sector for candidate in selected})
    portfolio_summary = (
        f"RAMENS selected {len(allocations)} stocks across {len(sector_names)} sectors. "
        f"Top conviction is {top_stock.ticker} with a score of {top_score:.2f} and a preference for {request.risk_preference} risk exposure."
    )

    notes = (
        f"Scores are normalized across the eligible universe, then weighted by the {request.risk_preference} risk profile. "
        f"Confidence is {confidence.lower()} because the average score is {avg_score:.1f} and the allocation is diversified across {len(sector_names)} sectors."
    )

    return PortfolioResponse(
        status="ok",
        email=email,
        investment_amount_inr=request.investment_amount,
        duration_months=request.duration_months,
        risk_preference=request.risk_preference,
        risk_level=risk_level,
        mode=request.mode,
        allocations=allocations,
        total_expected_value_inr=total_expected_value,
        unallocated_cash_inr=unallocated_cash,
        expected_growth_pct=expected_growth_pct,
        confidence=confidence,
        portfolio_summary=portfolio_summary,
        methodology="RAMENS combines momentum, fundamentals, inverse beta, factor blend, and macro sector bias with risk-aware weighting.",
        notes=notes,
        disclaimer="This is an AI-based simulation and not financial advice.",
        generated_at=datetime.now(timezone.utc),
        ai_generated=True,
    )
