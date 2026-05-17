from __future__ import annotations

import csv
import json
import threading
from pathlib import Path
from typing import Dict, List, Optional

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
PORTFOLIOS_CSV = DATA_DIR / "portfolios.csv"
USERS_CSV = DATA_DIR / "users.csv"

PORTFOLIO_HEADERS = ["Email", "Risk", "Investment", "Stocks", "ExpectedReturn", "Date"]
USER_HEADERS = ["Email", "Name", "PasswordHash", "CreatedAt"]
CHAT_HEADERS = ["Email", "UserMessage", "BotResponse", "Timestamp"]
CHAT_CSV = DATA_DIR / "chat_history.csv"
_LOCK = threading.Lock()


def ensure_csv_file(path: Path, headers: List[str]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if path.exists():
        return
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()


def read_csv_rows(path: Path, headers: List[str]) -> List[Dict[str, str]]:
    ensure_csv_file(path, headers)
    with path.open("r", newline="", encoding="utf-8") as handle:
        return [row for row in csv.DictReader(handle)]


def append_row(path: Path, headers: List[str], row: Dict[str, str]) -> None:
    ensure_csv_file(path, headers)
    with _LOCK:
        with path.open("a", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=headers)
            writer.writerow(row)


def append_user_row(row: Dict[str, str]) -> None:
    append_row(USERS_CSV, USER_HEADERS, row)


def find_user_by_email(email: str) -> Optional[Dict[str, str]]:
    normalized = email.strip().lower()
    for row in read_csv_rows(USERS_CSV, USER_HEADERS):
        if row.get("Email", "").strip().lower() == normalized:
            return row
    return None


def append_portfolio_row(row: Dict[str, str]) -> None:
    append_row(PORTFOLIOS_CSV, PORTFOLIO_HEADERS, row)


def get_portfolios_for_email(email: str) -> List[Dict[str, str]]:
    normalized = email.strip().lower()
    return [row for row in read_csv_rows(PORTFOLIOS_CSV, PORTFOLIO_HEADERS) if row.get("Email", "").strip().lower() == normalized]


def serialize_stocks(stocks: List[Dict[str, object]]) -> str:
    return json.dumps(stocks, ensure_ascii=False)


def ensure_storage_ready() -> None:
    ensure_csv_file(PORTFOLIOS_CSV, PORTFOLIO_HEADERS)
    ensure_csv_file(USERS_CSV, USER_HEADERS)
    ensure_csv_file(CHAT_CSV, CHAT_HEADERS)


def append_chat_row(row: Dict[str, str]) -> None:
    append_row(CHAT_CSV, CHAT_HEADERS, row)


def get_chat_history_for_email(email: str) -> List[Dict[str, str]]:
    normalized = email.strip().lower()
    return [row for row in read_csv_rows(CHAT_CSV, CHAT_HEADERS) if row.get("Email", "").strip().lower() == normalized]
