"""
Performance tracking module for comparing predicted vs actual returns.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional

from backend.finance_data import get_live_price
from backend.storage import append_row, read_csv_rows
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
TRACKING_CSV = DATA_DIR / "tracking.csv"

TRACKING_HEADERS = ["Email", "PortfolioID", "PredictedReturn", "ActualReturn", "Accuracy", "Date", "CreatedAt", "CheckedAt"]


@dataclass
class PerformanceRecord:
    email: str
    portfolio_id: str
    predicted_return: float
    actual_return: Optional[float] = None
    accuracy: Optional[float] = None
    created_at: str = ""
    checked_at: Optional[str] = None

    def to_dict(self) -> Dict[str, str]:
        return {
            "Email": self.email,
            "PortfolioID": self.portfolio_id,
            "PredictedReturn": f"{self.predicted_return:.2f}",
            "ActualReturn": f"{self.actual_return:.2f}" if self.actual_return is not None else "",
            "Accuracy": f"{self.accuracy:.2f}" if self.accuracy is not None else "",
            "Date": self.created_at,
            "CreatedAt": self.created_at,
            "CheckedAt": self.checked_at or "",
        }


def ensure_tracking_csv() -> None:
    """Ensure tracking CSV file exists with headers."""
    from backend.storage import ensure_csv_file
    ensure_csv_file(TRACKING_CSV, TRACKING_HEADERS)


def save_tracking_record(email: str, portfolio_id: str, predicted_return: float) -> None:
    """Save initial performance tracking record."""
    ensure_tracking_csv()
    now = datetime.now(timezone.utc).isoformat()
    record = PerformanceRecord(
        email=email,
        portfolio_id=portfolio_id,
        predicted_return=predicted_return,
        created_at=now,
    )
    append_row(TRACKING_CSV, TRACKING_HEADERS, record.to_dict())


def get_tracking_records(email: str) -> List[Dict[str, str]]:
    """Get all performance tracking records for a user."""
    ensure_tracking_csv()
    all_records = read_csv_rows(TRACKING_CSV, TRACKING_HEADERS)
    normalized_email = email.strip().lower()
    return [
        row for row in all_records
        if row.get("Email", "").strip().lower() == normalized_email
    ]


def update_actual_return(email: str, portfolio_id: str, allocations: List[Dict]) -> Optional[Dict]:
    """
    Calculate actual return based on current prices and update tracking record.
    
    allocations format: [{"ticker": "TCS.NS", "shares": 10, "entry_price_inr": 3800}, ...]
    """
    ensure_tracking_csv()
    now = datetime.now(timezone.utc).isoformat()

    # Calculate actual value
    actual_value = 0.0
    entry_value = 0.0

    for alloc in allocations:
        ticker = alloc.get("ticker", "")
        shares = float(alloc.get("shares", 0))
        entry_price = float(alloc.get("entry_price_inr", 0))

        if ticker and shares > 0:
            current_price = get_live_price(ticker)
            actual_value += shares * current_price
            entry_value += shares * entry_price

    if entry_value <= 0:
        return None

    actual_return_pct = ((actual_value - entry_value) / entry_value) * 100

    # Read all records and find matching one
    all_records = read_csv_rows(TRACKING_CSV, TRACKING_HEADERS)
    normalized_email = email.strip().lower()

    for row in all_records:
        if (row.get("Email", "").strip().lower() == normalized_email and
                row.get("PortfolioID", "").strip() == portfolio_id.strip()):
            predicted_return = float(row.get("PredictedReturn", 0))
            accuracy = ((actual_return_pct - predicted_return) / abs(predicted_return + 0.001)) * 100 if predicted_return != 0 else 0

            return {
                "email": email,
                "portfolio_id": portfolio_id,
                "predicted_return": predicted_return,
                "actual_return": actual_return_pct,
                "accuracy": accuracy,
                "checked_at": now,
            }

    return None


def get_performance_summary(email: str) -> Dict:
    """Get aggregated performance metrics for a user."""
    records = get_tracking_records(email)

    completed_records = [
        r for r in records
        if r.get("ActualReturn") and r.get("ActualReturn").strip()
    ]

    if not completed_records:
        return {
            "total_portfolios": len(records),
            "tracked_portfolios": len(completed_records),
            "avg_predicted_return": 0.0,
            "avg_actual_return": 0.0,
            "avg_accuracy": 0.0,
            "accuracy_range": {"min": 0.0, "max": 0.0},
        }

    predicted_returns = [float(r.get("PredictedReturn", 0)) for r in completed_records]
    actual_returns = [float(r.get("ActualReturn", 0)) for r in completed_records]
    accuracies = [float(r.get("Accuracy", 0)) for r in completed_records if r.get("Accuracy")]

    avg_predicted = sum(predicted_returns) / len(predicted_returns) if predicted_returns else 0.0
    avg_actual = sum(actual_returns) / len(actual_returns) if actual_returns else 0.0
    avg_accuracy = sum(accuracies) / len(accuracies) if accuracies else 0.0

    return {
        "total_portfolios": len(records),
        "tracked_portfolios": len(completed_records),
        "avg_predicted_return": round(avg_predicted, 2),
        "avg_actual_return": round(avg_actual, 2),
        "avg_accuracy": round(avg_accuracy, 2),
        "accuracy_range": {
            "min": round(min(accuracies), 2) if accuracies else 0.0,
            "max": round(max(accuracies), 2) if accuracies else 0.0,
        },
    }
