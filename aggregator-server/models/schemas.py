import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


# ---------- Shared enums ----------

IdentityType = Literal["BVN", "NIN", "CAC", "GHANA_CARD"]
VerificationStatus = Literal["verified", "failed", "pending"]
ConsentStep = Literal["initiated", "otp_sent", "confirmed", "granted", "denied", "expired"]
Mode = Literal["sandbox", "live"]
RiskBand = Literal["low", "medium", "high"]


# ---------- POST /v1/verify ----------

class VerifyRequest(BaseModel):
    identity_type: IdentityType
    identifier: str = Field(..., min_length=4, description="BVN, NIN, CAC number, or Ghana Card ID")
    consent_session_id: uuid.UUID | None = Field(
        None, description="Required for identity types that need consent orchestration (e.g. BVN)"
    )


class VerifyResponse(BaseModel):
    identity_ref: uuid.UUID
    status: VerificationStatus
    provider_used: str
    name_matched: bool | None = None
    dob_matched: bool | None = None
    confidence_score: float | None = None
    mode: Mode
    created_at: datetime

    class Config:
        from_attributes = True   # lets this build directly from the SQLAlchemy row


# ---------- Consent orchestration ----------

class ConsentInitiateRequest(BaseModel):
    identity_type: IdentityType
    phone_number: str = Field(..., description="Number the OTP will be sent to")


class ConsentInitiateResponse(BaseModel):
    consent_session_id: uuid.UUID
    step: ConsentStep
    expires_at: datetime


class ConsentConfirmRequest(BaseModel):
    consent_session_id: uuid.UUID
    otp: str = Field(..., min_length=4, max_length=8)


class ConsentConfirmResponse(BaseModel):
    consent_session_id: uuid.UUID
    step: ConsentStep


# ---------- POST /v1/score ----------

class Transaction(BaseModel):
    amount: float
    narration: str | None = None
    category: str | None = None
    date: datetime
    balance_after: float | None = None


class ScoreRequest(BaseModel):
    identity_ref: uuid.UUID
    transactions: list[Transaction] = Field(..., min_length=1)


class ScoreResponse(BaseModel):
    identity_ref: uuid.UUID
    score: float
    risk_band: RiskBand
    contributing_factors: dict[str, float]
    mode: Mode
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Shared error shape (matches core/errors.py) ----------

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict = {}


class ErrorResponse(BaseModel):
    error: ErrorDetail