from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.alerts import check_alerts_for_portfolio, create_price_drop_alert, create_target_alert, get_user_alerts
from backend.auth import authenticate_account, create_access_token, decode_token, register_account
from backend.backtesting import backtest_portfolio, compare_backtest_results
from backend.models_comparison import compare_models
from backend.ramens import generate_ramens_portfolio
from backend.schemas import GeneratePortfolioRequest, LoginRequest, PortfolioResponse, RegisterRequest, SavePortfolioRequest
from backend.storage import append_portfolio_row, ensure_storage_ready, get_portfolios_for_email, serialize_stocks
from backend.tracking import get_performance_summary, get_tracking_records, save_tracking_record, update_actual_return

app = FastAPI(title="INTELLiINVEST API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROTECTED_PATHS = {
    "/generate-portfolio",
    "/save-portfolio",
    "/get-portfolios",
    "/me",
    "/track-performance",
    "/compare-performance",
    "/backtest-portfolio",
    "/compare-models",
    "/alerts",
    "/alerts/create-price-drop",
    "/alerts/create-target",
}


@app.on_event("startup")
def _startup() -> None:
    ensure_storage_ready()


@app.middleware("http")
async def jwt_middleware(request: Request, call_next):
    path = request.url.path.rstrip("/") or "/"
    if path in PROTECTED_PATHS:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Missing bearer token"})

        token = auth_header.removeprefix("Bearer ").strip()
        try:
            token_payload = decode_token(token)
        except Exception:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "Invalid or expired token"})

        request.state.user_email = token_payload.get("email") or token_payload.get("sub") or ""
        request.state.user_name = token_payload.get("name") or (request.state.user_email.split("@")[0] if request.state.user_email else "user")

    response = await call_next(request)
    return response


@app.get("/")
def root() -> Dict[str, str]:
    return {
        "name": "INTELLiINVEST API",
        "status": "ok",
        "documentation": "/docs",
    }


@app.post("/auth/register")
def register(payload: RegisterRequest) -> Dict[str, Any]:
    try:
        user = register_account(payload.email, payload.password, payload.name)
        token = create_access_token(subject=user["email"], email=user["email"], name=user["name"])
        return {
            "status": "ok",
            "message": "Registration successful",
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@app.post("/auth/login")
def login(payload: LoginRequest) -> Dict[str, Any]:
    try:
        user = authenticate_account(payload.email, payload.password)
        token = create_access_token(subject=user["email"], email=user["email"], name=user["name"])
        return {
            "status": "ok",
            "message": "Login successful",
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


@app.get("/me")
def me(request: Request) -> Dict[str, Any]:
    return {
        "status": "ok",
        "email": request.state.user_email,
        "name": request.state.user_name,
    }


def _save_portfolio_record(portfolio: PortfolioResponse) -> Dict[str, str]:
    append_portfolio_row(
        {
            "Email": portfolio.email,
            "Risk": portfolio.risk_preference,
            "Investment": f"{portfolio.investment_amount_inr:.2f}",
            "Stocks": serialize_stocks([stock.model_dump() for stock in portfolio.allocations]),
            "ExpectedReturn": f"{portfolio.expected_growth_pct:.2f}",
            "Date": portfolio.generated_at.astimezone(timezone.utc).isoformat(),
        }
    )
    return {"status": "ok", "message": "Portfolio saved"}


@app.post("/generate-portfolio")
def generate_portfolio(request: Request, payload: GeneratePortfolioRequest) -> Dict[str, Any]:
    portfolio = generate_ramens_portfolio(payload, email=request.state.user_email)
    _save_portfolio_record(portfolio)
    return portfolio.model_dump()


@app.post("/save-portfolio")
def save_portfolio(request: Request, payload: SavePortfolioRequest) -> Dict[str, Any]:
    portfolio = payload.portfolio
    if portfolio.email.lower() != request.state.user_email.lower():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only save your own portfolios")
    return _save_portfolio_record(portfolio)


@app.get("/get-portfolios")
def get_portfolios(request: Request, email: str | None = None) -> Dict[str, Any]:
    requested_email = email or request.state.user_email
    if requested_email.lower() != request.state.user_email.lower():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only access your own portfolio history")

    rows = get_portfolios_for_email(requested_email)
    parsed_rows: List[Dict[str, Any]] = []
    for row in rows:
        stocks_raw = row.get("Stocks", "[]")
        try:
            stocks = json.loads(stocks_raw)
        except Exception:
            stocks = []
        parsed_rows.append(
            {
                "email": row.get("Email", requested_email),
                "risk": row.get("Risk", "moderate"),
                "investment": float(row.get("Investment", 0) or 0),
                "stocks": stocks,
                "expectedReturn": float(row.get("ExpectedReturn", 0) or 0),
                "date": row.get("Date", ""),
            }
        )

    return {
        "status": "ok",
        "email": requested_email,
        "count": len(parsed_rows),
        "items": parsed_rows,
    }


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


# ==================== PERFORMANCE TRACKING ====================


@app.post("/track-performance")
def track_performance(request: Request, portfolio_id: str) -> Dict[str, Any]:
    """
    Save a portfolio for performance tracking.
    Stores predicted return and sets up actual return tracking.
    """
    portfolios = get_portfolios_for_email(request.state.user_email)
    
    matching = [
        json.loads(p.get("Stocks", "[]"))
        for p in portfolios
        if p.get("Date", "").startswith(portfolio_id[:10])
    ]

    if not matching:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    predicted_return = float(matching[0][0].get("expected_return_pct", 0)) if matching[0] else 0
    save_tracking_record(request.state.user_email, portfolio_id, predicted_return)

    return {
        "status": "ok",
        "message": "Portfolio tracking started",
        "portfolio_id": portfolio_id,
        "predicted_return": round(predicted_return, 2),
    }


@app.get("/compare-performance")
def compare_performance(request: Request, portfolio_id: str) -> Dict[str, Any]:
    """
    Compare predicted vs actual return for a portfolio.
    Fetches current prices and calculates actual return.
    """
    portfolios = get_portfolios_for_email(request.state.user_email)
    
    matching_portfolio = None
    for p in portfolios:
        if p.get("Date", "").startswith(portfolio_id[:10]):
            matching_portfolio = p
            break

    if not matching_portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    allocations = json.loads(matching_portfolio.get("Stocks", "[]"))
    result = update_actual_return(request.state.user_email, portfolio_id, allocations)

    if not result:
        return {
            "status": "pending",
            "message": "Portfolio too new or no allocations",
            "portfolio_id": portfolio_id,
        }

    return {
        "status": "ok",
        "portfolio_id": portfolio_id,
        "predicted_return_pct": round(result["predicted_return"], 2),
        "actual_return_pct": round(result["actual_return"], 2),
        "accuracy_pct": round(result["accuracy"], 2),
        "checked_at": result["checked_at"],
    }


@app.get("/performance-summary")
def performance_summary(request: Request) -> Dict[str, Any]:
    """Get aggregated performance metrics for user."""
    summary = get_performance_summary(request.state.user_email)
    return {
        "status": "ok",
        "email": request.state.user_email,
        **summary,
    }


# ==================== BACKTESTING ====================


@app.post("/backtest-portfolio")
def backtest_portfolio_endpoint(
    request: Request,
    allocations: List[Dict],
    investment_amount: float,
    days_back: int = 365,
) -> Dict[str, Any]:
    """
    Backtest a portfolio over historical data.
    """
    try:
        result = backtest_portfolio(allocations, investment_amount, days_back)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message", "Backtesting failed"))
        
        return {
            "status": "ok",
            "email": request.state.user_email,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/compare-backtests")
def compare_backtests(
    request: Request,
    allocations1: List[Dict],
    allocations2: List[Dict],
    investment_amount: float,
    days_back: int = 365,
) -> Dict[str, Any]:
    """
    Compare backtesting results of two portfolios.
    """
    try:
        result = compare_backtest_results(allocations1, allocations2, investment_amount, days_back)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message", "Comparison failed"))
        
        return {
            "status": "ok",
            "email": request.state.user_email,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ==================== MODEL COMPARISON ====================


@app.post("/compare-models")
def compare_models_endpoint(
    request: Request,
    allocations: List[Dict],
    expected_return: float,
    volatility: float,
) -> Dict[str, Any]:
    """
    Compare CAPM, Markowitz, and RAMENS models.
    Shows which model provides best risk-adjusted returns.
    """
    # Generate synthetic expected returns and covariance matrix
    expected_returns = [expected_return * (0.9 + i * 0.02) for i in range(len(allocations))]
    
    # Create covariance matrix (simplified)
    n = len(allocations)
    covariance_matrix = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                covariance_matrix[i][j] = volatility ** 2
            else:
                covariance_matrix[i][j] = volatility ** 2 * 0.3

    try:
        result = compare_models(
            allocations,
            expected_return,
            volatility,
            expected_returns,
            covariance_matrix,
            risk_free_rate=6.0,
            market_return=12.0,
            portfolio_beta=1.0,
        )

        return {
            "status": "ok",
            "email": request.state.user_email,
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# ==================== ALERTS ====================


class PriceDropAlertRequest:
    def __init__(self, ticker: str, drop_threshold_pct: float = 10.0):
        self.ticker = ticker
        self.drop_threshold_pct = drop_threshold_pct


class TargetAlertRequest:
    def __init__(self, ticker: str, target_price: float):
        self.ticker = ticker
        self.target_price = target_price


@app.post("/alerts/create-price-drop")
def create_price_drop_alert_endpoint(
    request: Request,
    ticker: str,
    drop_threshold_pct: float = 10.0,
) -> Dict[str, Any]:
    """
    Create alert for price drop on a stock.
    """
    try:
        alert = create_price_drop_alert(request.state.user_email, ticker, drop_threshold_pct)
        
        if alert:
            return {
                "status": "ok",
                "message": "Alert created",
                "alert": alert,
            }
        else:
            return {
                "status": "ok",
                "message": "Stock price drop below threshold",
                "alert": None,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/alerts/create-target")
def create_target_alert_endpoint(
    request: Request,
    ticker: str,
    target_price: float,
) -> Dict[str, Any]:
    """
    Create alert for when stock reaches target price.
    """
    try:
        alert = create_target_alert(request.state.user_email, ticker, target_price)
        
        if alert:
            return {
                "status": "ok",
                "message": "Target reached",
                "alert": alert,
            }
        else:
            return {
                "status": "ok",
                "message": "Stock has not reached target price yet",
                "alert": None,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/alerts")
def get_alerts(request: Request) -> Dict[str, Any]:
    """Get all alerts for the user."""
    alerts = get_user_alerts(request.state.user_email)
    
    return {
        "status": "ok",
        "email": request.state.user_email,
        "count": len(alerts),
        "alerts": alerts,
    }


@app.post("/alerts/check-portfolio")
def check_portfolio_alerts(
    request: Request,
    allocations: List[Dict],
    drop_threshold_pct: float = 10.0,
) -> Dict[str, Any]:
    """
    Check for active alerts on all stocks in a portfolio.
    """
    try:
        triggered = check_alerts_for_portfolio(
            request.state.user_email,
            allocations,
            drop_threshold_pct,
        )

        return {
            "status": "ok",
            "email": request.state.user_email,
            "triggered_count": len(triggered),
            "triggered_alerts": triggered,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

