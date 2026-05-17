from __future__ import annotations

import asyncio
import json
import re
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Deque, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from backend.storage import append_chat_row, get_chat_history_for_email, get_portfolios_for_email

router = APIRouter()

MAX_CONTEXT_MESSAGES = 12
MAX_MESSAGE_CHARS = 1200
RATE_WINDOW_SECONDS = 60
RATE_MAX_REQUESTS = 40

_session_memory: Dict[str, Deque[Dict[str, str]]] = defaultdict(deque)
_rate_limiter: Dict[str, Deque[float]] = defaultdict(deque)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)
    mode: str = Field(default="portfolio-assistant")
    session_id: Optional[str] = None
    level: str = Field(default="intermediate")


class AnalyzeRequest(BaseModel):
    allocations: List[Dict[str, Any]] = Field(default_factory=list)


def _format_sse(data: Dict[str, Any]) -> bytes:
    return f"data: {json.dumps(data)}\n\n".encode("utf-8")


def _sanitize_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"[<>]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text[:MAX_MESSAGE_CHARS]


def _check_rate_limit(identity: str) -> None:
    now = datetime.now(timezone.utc).timestamp()
    bucket = _rate_limiter[identity]
    while bucket and (now - bucket[0]) > RATE_WINDOW_SECONDS:
        bucket.popleft()
    if len(bucket) >= RATE_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Too many chat requests. Please try again shortly.")
    bucket.append(now)


def _session_key(user_email: str, session_id: Optional[str]) -> str:
    return f"{user_email}:{session_id or 'default'}"


def _detect_intent(message: str) -> str:
    m = message.lower()
    if any(k in m for k in ["rebalance", "rebalancing", "allocation"]):
        return "rebalancing-request"
    if any(k in m for k in ["risk", "beta", "volatility", "sharpe"]):
        return "risk-query"
    if any(k in m for k in ["capm", "markowitz", "diversification", "cagr"]):
        return "educational-query"
    if any(k in m for k in ["predicted", "actual", "tracking", "underperformance"]):
        return "performance-tracking"
    if any(k in m for k in ["compare", "vs", "versus"]):
        return "comparison-query"
    return "portfolio-explanation"


def _xai_contributions(mode: str, intent: str) -> Dict[str, int]:
    if mode == "financial-tutor" or intent == "educational-query":
        return {"Fundamentals": 28, "Momentum": 14, "Macro": 18, "Beta": 12, "Sector": 28}
    if mode == "risk-advisor" or intent == "risk-query":
        return {"Fundamentals": 22, "Momentum": 10, "Macro": 24, "Beta": 30, "Sector": 14}
    return {"Fundamentals": 40, "Momentum": 18, "Macro": 14, "Beta": 16, "Sector": 12}


async def _stream_response(
    user_email: str,
    message: str,
    mode: str,
    level: str,
    session_id: Optional[str],
) -> AsyncGenerator[bytes, None]:
    portfolios = get_portfolios_for_email(user_email)
    latest = portfolios[-1] if portfolios else None
    intent = _detect_intent(message)
    factors = _xai_contributions(mode, intent)

    key = _session_key(user_email, session_id)
    memory = _session_memory[key]

    portfolio_line = "No saved portfolio context found yet."
    allocations = [
        {"ticker": "TCS", "pct": 24},
        {"ticker": "INFY", "pct": 18},
        {"ticker": "HDFCBANK", "pct": 14},
        {"ticker": "ICICIBANK", "pct": 12},
        {"ticker": "Others", "pct": 32},
    ]
    if latest:
        portfolio_line = (
            f"Latest portfolio date {latest.get('Date', 'n/a')} with expected return "
            f"{latest.get('ExpectedReturn', 'n/a')}%."
        )
        try:
            parsed = json.loads(latest.get("Stocks", "[]"))
            allocations = [
                {"ticker": item.get("ticker", item.get("company", "UNK")), "pct": round(float(item.get("allocation_pct", 0)) or 0, 2)}
                for item in parsed[:5]
            ]
            remainder = max(0.0, round(100.0 - sum(i["pct"] for i in allocations), 2))
            if remainder > 0:
                allocations.append({"ticker": "Others", "pct": remainder})
        except Exception:
            pass

    teaching_line = {
        "beginner": "I will keep this beginner-friendly with practical definitions.",
        "intermediate": "I will include practical finance logic and trade-offs.",
        "advanced": "I will include model-level details and assumptions.",
    }.get(level, "I will include practical finance logic and trade-offs.")

    response_parts = [
        f"Analyzing your request in {mode} mode with intent {intent}.",
        portfolio_line,
        teaching_line,
        "I am generating explainable factor contributions and risk insights.",
    ]

    final_text = ""
    for piece in response_parts:
        await asyncio.sleep(0.2)
        final_text += piece + " "
        yield _format_sse({"type": "token", "text": piece})

    confidence = 79.2 if mode != "risk-advisor" else 74.1
    explanation = {
        "type": "explanation",
        "title": "RAMENS factor contributions",
        "factors": factors,
        "confidence": confidence,
        "intent": intent,
        "summary": "Allocation preference is influenced by fundamentals and risk controls under current market regime.",
    }
    yield _format_sse(explanation)

    visual = {
        "type": "visual",
        "allocations": allocations,
        "growth": [
            {"month": "M1", "predicted": 100, "actual": 100},
            {"month": "M2", "predicted": 103, "actual": 101},
            {"month": "M3", "predicted": 106, "actual": 104},
            {"month": "M4", "predicted": 109, "actual": 105},
            {"month": "M5", "predicted": 113, "actual": 108},
            {"month": "M6", "predicted": 116, "actual": 110},
        ],
        "riskGauge": min(95, max(10, int(factors["Beta"] * 2.5))),
    }
    yield _format_sse(visual)

    suggestions = [
        "Review concentration risk if one sector exceeds 35%.",
        "Consider partial rebalance toward lower beta names.",
        "Track predicted vs actual monthly to calibrate assumptions.",
    ]
    yield _format_sse({"type": "suggestions", "items": suggestions})

    disclaimer = "This chatbot provides AI-generated financial insights for educational purposes only and not professional investment advice."
    final = {
        "type": "final",
        "text": f"{final_text.strip()} Completed analysis with actionable suggestions.",
        "disclaimer": disclaimer,
    }
    yield _format_sse(final)

    memory.append({"role": "user", "text": message})
    memory.append({"role": "assistant", "text": final["text"]})
    while len(memory) > MAX_CONTEXT_MESSAGES:
        memory.popleft()


@router.post("/")
async def chat(payload: ChatRequest, request: Request) -> StreamingResponse:
    user_email = getattr(request.state, "user_email", "anonymous@example.com")
    _check_rate_limit(user_email)

    message = _sanitize_text(payload.message)
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    timestamp = datetime.now(timezone.utc).isoformat()
    bot_summary: Dict[str, str] = {"value": ""}

    async def event_stream() -> AsyncGenerator[bytes, None]:
        async for chunk in _stream_response(user_email, message, payload.mode, payload.level, payload.session_id):
            try:
                decoded = chunk.decode("utf-8")
                if decoded.startswith("data: "):
                    body = decoded.replace("data: ", "", 1).strip()
                    if body.endswith("\n\n"):
                        body = body[:-2]
                    obj = json.loads(body)
                    if obj.get("type") == "final":
                        bot_summary["value"] = obj.get("text", "")
            except Exception:
                pass
            yield chunk

        append_chat_row(
            {
                "Email": user_email,
                "UserMessage": message,
                "BotResponse": bot_summary["value"] or "Completed streamed response",
                "Timestamp": timestamp,
            }
        )

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/history")
def history(request: Request, q: Optional[str] = None) -> Dict[str, Any]:
    user_email = getattr(request.state, "user_email", "anonymous@example.com")
    rows = get_chat_history_for_email(user_email)
    if q:
        needle = q.strip().lower()
        rows = [
            r
            for r in rows
            if needle in r.get("UserMessage", "").lower() or needle in r.get("BotResponse", "").lower()
        ]
    return {"status": "ok", "email": user_email, "count": len(rows), "items": rows[-100:]}


@router.get("/context")
def context(request: Request, session_id: Optional[str] = None) -> Dict[str, Any]:
    user_email = getattr(request.state, "user_email", "anonymous@example.com")
    portfolios = get_portfolios_for_email(user_email)
    latest = portfolios[-1] if portfolios else None
    key = _session_key(user_email, session_id)
    memory = list(_session_memory[key])
    return {"status": "ok", "email": user_email, "latest_portfolio": latest, "memory": memory}


@router.post("/analyze")
async def analyze(payload: AnalyzeRequest, request: Request) -> Dict[str, Any]:
    user_email = getattr(request.state, "user_email", "anonymous@example.com")
    _check_rate_limit(f"analyze:{user_email}")

    allocations = payload.allocations
    if not allocations:
        return {
            "status": "ok",
            "contributions": {"Fundamentals": 40, "Momentum": 20, "Macro": 15, "Beta": 15, "Sector": 10},
            "confidence": 72.0,
            "explanation": "No allocations provided. Returned baseline contribution profile.",
        }

    # Lightweight heuristic XAI summary for explainability cards.
    n = max(1, len(allocations))
    concentration_penalty = min(20, n * 2)
    contributions = {
        "Fundamentals": max(20, 45 - concentration_penalty // 2),
        "Momentum": 18,
        "Macro": 14,
        "Beta": min(30, 12 + concentration_penalty),
        "Sector": max(10, 100 - (max(20, 45 - concentration_penalty // 2) + 18 + 14 + min(30, 12 + concentration_penalty))),
    }
    confidence = round(84.0 - concentration_penalty * 0.6, 2)
    return {
        "status": "ok",
        "contributions": contributions,
        "confidence": confidence,
        "explanation": "Contributions reflect concentration-adjusted risk and factor balance.",
    }
