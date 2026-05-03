from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.auth import authenticate_account, create_access_token, decode_token, register_account
from backend.ramens import generate_ramens_portfolio
from backend.schemas import GeneratePortfolioRequest, LoginRequest, PortfolioResponse, RegisterRequest, SavePortfolioRequest
from backend.storage import append_portfolio_row, ensure_storage_ready, get_portfolios_for_email, serialize_stocks

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

PROTECTED_PATHS = {"/generate-portfolio", "/save-portfolio", "/get-portfolios", "/me"}


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
