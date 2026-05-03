"""
Alert system for portfolio price movements and target tracking.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

from backend.finance_data import get_live_price
from backend.storage import append_row, read_csv_rows

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
ALERTS_CSV = DATA_DIR / "alerts.csv"

ALERT_HEADERS = ["Email", "AlertID", "AlertType", "Ticker", "TriggerValue", "CurrentValue", "Message", "Status", "CreatedAt", "ResolvedAt"]


def ensure_alerts_csv() -> None:
    """Ensure alerts CSV file exists."""
    from backend.storage import ensure_csv_file
    ensure_csv_file(ALERTS_CSV, ALERT_HEADERS)


def generate_alert_id() -> str:
    """Generate unique alert ID based on timestamp."""
    return datetime.now(timezone.utc).isoformat()


def create_price_drop_alert(
    email: str,
    ticker: str,
    drop_threshold_pct: float = 10.0,
) -> Optional[Dict]:
    """
    Create alert if stock price dropped more than threshold.
    """
    from backend.ramens import _read_json

    # Get original price from market data or top stocks
    market_data_path = Path(__file__).resolve().parents[1] / "src" / "data" / "market-data.json"
    top_stocks_path = Path(__file__).resolve().parents[1] / "data" / "top-stocks.json"

    original_price = None
    for path in [market_data_path, top_stocks_path]:
        data = _read_json(path)
        if data:
            if isinstance(data, list):
                for item in data:
                    if item.get("ticker") == ticker:
                        original_price = float(item.get("price", 0))
                        break
            elif isinstance(data, dict):
                if ticker in data:
                    original_price = float(data[ticker].get("price", 0))
                    break

    if not original_price:
        return None

    current_price = get_live_price(ticker)
    drop_pct = ((original_price - current_price) / original_price) * 100

    if drop_pct >= drop_threshold_pct:
        alert_id = generate_alert_id()
        ensure_alerts_csv()

        message = f"{ticker} dropped {drop_pct:.1f}% (from ₹{original_price:.2f} to ₹{current_price:.2f})"
        alert_row = {
            "Email": email,
            "AlertID": alert_id,
            "AlertType": "PRICE_DROP",
            "Ticker": ticker,
            "TriggerValue": f"{drop_threshold_pct:.2f}",
            "CurrentValue": f"{drop_pct:.2f}",
            "Message": message,
            "Status": "ACTIVE",
            "CreatedAt": datetime.now(timezone.utc).isoformat(),
            "ResolvedAt": "",
        }

        append_row(ALERTS_CSV, ALERT_HEADERS, alert_row)

        return {
            "alert_id": alert_id,
            "type": "PRICE_DROP",
            "ticker": ticker,
            "drop_pct": round(drop_pct, 2),
            "original_price": round(original_price, 2),
            "current_price": round(current_price, 2),
            "message": message,
            "created_at": alert_row["CreatedAt"],
        }

    return None


def create_target_alert(
    email: str,
    ticker: str,
    target_price: float,
) -> Optional[Dict]:
    """
    Create alert when stock reaches target price.
    """
    current_price = get_live_price(ticker)

    if current_price >= target_price:
        alert_id = generate_alert_id()
        ensure_alerts_csv()

        message = f"{ticker} reached target ₹{target_price:.2f} (current: ₹{current_price:.2f})"
        alert_row = {
            "Email": email,
            "AlertID": alert_id,
            "AlertType": "TARGET_REACHED",
            "Ticker": ticker,
            "TriggerValue": f"{target_price:.2f}",
            "CurrentValue": f"{current_price:.2f}",
            "Message": message,
            "Status": "RESOLVED",
            "CreatedAt": datetime.now(timezone.utc).isoformat(),
            "ResolvedAt": datetime.now(timezone.utc).isoformat(),
        }

        append_row(ALERTS_CSV, ALERT_HEADERS, alert_row)

        return {
            "alert_id": alert_id,
            "type": "TARGET_REACHED",
            "ticker": ticker,
            "target_price": round(target_price, 2),
            "current_price": round(current_price, 2),
            "message": message,
            "created_at": alert_row["CreatedAt"],
        }

    return None


def get_user_alerts(email: str) -> List[Dict]:
    """Get all alerts for a user."""
    ensure_alerts_csv()
    all_alerts = read_csv_rows(ALERTS_CSV, ALERT_HEADERS)
    normalized_email = email.strip().lower()

    user_alerts = [
        row for row in all_alerts
        if row.get("Email", "").strip().lower() == normalized_email
    ]

    return [
        {
            "alert_id": row.get("AlertID", ""),
            "type": row.get("AlertType", ""),
            "ticker": row.get("Ticker", ""),
            "trigger_value": row.get("TriggerValue", ""),
            "current_value": row.get("CurrentValue", ""),
            "message": row.get("Message", ""),
            "status": row.get("Status", ""),
            "created_at": row.get("CreatedAt", ""),
            "resolved_at": row.get("ResolvedAt", ""),
        }
        for row in user_alerts
    ]


def check_alerts_for_portfolio(
    email: str,
    allocations: List[Dict],
    drop_threshold_pct: float = 10.0,
) -> List[Dict]:
    """
    Check for active alerts on all stocks in a portfolio.
    Returns list of triggered alerts.
    """
    triggered_alerts = []

    for alloc in allocations:
        ticker = alloc.get("ticker", "")
        if ticker:
            # Check for price drop
            alert = create_price_drop_alert(email, ticker, drop_threshold_pct)
            if alert:
                triggered_alerts.append(alert)

    return triggered_alerts


def acknowledge_alert(alert_id: str) -> bool:
    """Mark an alert as acknowledged."""
    ensure_alerts_csv()
    all_alerts = read_csv_rows(ALERTS_CSV, ALERT_HEADERS)

    for row in all_alerts:
        if row.get("AlertID", "").strip() == alert_id.strip():
            row["Status"] = "ACKNOWLEDGED"
            row["ResolvedAt"] = datetime.now(timezone.utc).isoformat()
            return True

    return False
