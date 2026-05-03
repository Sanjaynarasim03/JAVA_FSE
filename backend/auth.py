from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import bcrypt
import jwt

from backend.storage import append_user_row, find_user_by_email

SECRET_KEY = os.getenv("INTELLiINVEST_SECRET_KEY", "intelliinvest-dev-secret")
ALGORITHM = os.getenv("INTELLiINVEST_JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("INTELLiINVEST_ACCESS_TOKEN_EXPIRE_MINUTES", "480"))


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(subject: str, email: str, name: str | None = None) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload: Dict[str, Any] = {
        "sub": subject,
        "email": email,
        "name": name or email.split("@")[0],
        "iat": datetime.now(timezone.utc).timestamp(),
        "exp": expires_at,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def register_account(email: str, password: str, name: str) -> Dict[str, str]:
    existing_user = find_user_by_email(email)
    if existing_user:
        raise ValueError("An account with this email already exists")

    user_row = {
        "Email": email.lower(),
        "Name": name,
        "PasswordHash": hash_password(password),
        "CreatedAt": datetime.now(timezone.utc).isoformat(),
    }
    append_user_row(user_row)
    return {
        "email": email.lower(),
        "name": name,
    }


def authenticate_account(email: str, password: str) -> Dict[str, str]:
    user = find_user_by_email(email)
    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user["PasswordHash"]):
        raise ValueError("Invalid email or password")

    return {
        "email": user["Email"],
        "name": user.get("Name") or user["Email"].split("@")[0],
        "created_at": user.get("CreatedAt", ""),
    }
