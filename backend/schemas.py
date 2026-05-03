from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

RiskPreference = Literal["low", "moderate", "high"]
PortfolioMode = Literal["auto", "single", "multiple"]
RiskLevel = Literal["Low", "Moderate", "High"]


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class GeneratePortfolioRequest(BaseModel):
    investment_amount: float = Field(gt=0, le=50_000_000)
    duration_months: int = Field(default=12, ge=3, le=60)
    risk_preference: RiskPreference = "moderate"
    mode: PortfolioMode = "auto"
    preferred_tickers: Optional[List[str]] = None

    @field_validator("preferred_tickers")
    @classmethod
    def normalize_tickers(cls, value: Optional[List[str]]) -> Optional[List[str]]:
        if value is None:
            return value
        tickers = [ticker.strip().upper() for ticker in value if ticker and ticker.strip()]
        return tickers or None


class StockAllocation(BaseModel):
    rank: int
    company: str
    ticker: str
    allocation_inr: float
    shares: int
    entry_price_inr: float
    expected_return_pct: float
    expected_value_inr: float
    risk: RiskLevel
    rationale: str
    score: float | None = None
    factor_breakdown: Dict[str, float] | None = None


class PortfolioResponse(BaseModel):
    status: Literal["ok", "error"] = "ok"
    email: EmailStr
    investment_amount_inr: float
    duration_months: int
    risk_preference: RiskPreference
    risk_level: RiskLevel
    mode: PortfolioMode
    allocations: List[StockAllocation]
    total_expected_value_inr: float
    unallocated_cash_inr: float
    expected_growth_pct: float
    confidence: Literal["Low", "Medium", "High"]
    portfolio_summary: str
    methodology: str
    notes: str
    disclaimer: str
    generated_at: datetime
    ai_generated: bool = True


class SavePortfolioRequest(BaseModel):
    portfolio: PortfolioResponse

