import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, ForeignKey, Numeric, CheckConstraint, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Developer(Base):
    __tablename__ = "developers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    company_name: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    api_keys: Mapped[list["APIKey"]] = relationship(back_populates="developer")


class APIKey(Base):
    __tablename__ = "api_keys"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    developer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("developers.id"), nullable=False)
    key_hash: Mapped[str] = mapped_column(String, nullable=False)
    mode: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    last_used_at: Mapped[datetime | None] = mapped_column(nullable=True)

    developer: Mapped["Developer"] = relationship(back_populates="api_keys")

    __table_args__ = (
        CheckConstraint("mode IN ('sandbox', 'live')", name="ck_api_keys_mode"),
    )


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    identity_ref: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4
    )
    developer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("developers.id"), nullable=False)
    identity_type: Mapped[str] = mapped_column(String, nullable=False)
    identifier_last4: Mapped[str | None] = mapped_column(String(4), nullable=True)
    provider_used: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    name_matched: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    dob_matched: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String, nullable=True)
    mode: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    expires_at: Mapped[datetime | None] = mapped_column(nullable=True)

    __table_args__ = (
        CheckConstraint(
            "identity_type IN ('BVN', 'NIN', 'CAC', 'GHANA_CARD')",
            name="ck_verifications_identity_type",
        ),
        CheckConstraint(
            "status IN ('verified', 'failed', 'pending')",
            name="ck_verifications_status",
        ),
        CheckConstraint("mode IN ('sandbox', 'live')", name="ck_verifications_mode"),
    )


class ConsentSession(Base):
    __tablename__ = "consent_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    developer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("developers.id"), nullable=False)
    identity_type: Mapped[str] = mapped_column(String, nullable=False)
    step: Mapped[str] = mapped_column(String, nullable=False)
    provider: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(nullable=False)

    __table_args__ = (
        CheckConstraint(
            "step IN ('initiated', 'otp_sent', 'confirmed', 'granted', 'denied', 'expired')",
            name="ck_consent_sessions_step",
        ),
    )


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    identity_ref: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("verifications.identity_ref"), nullable=False
    )
    developer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("developers.id"), nullable=False)
    score: Mapped[float] = mapped_column(Numeric, nullable=False)
    risk_band: Mapped[str | None] = mapped_column(String, nullable=True)
    contributing_factors: Mapped[dict] = mapped_column(JSONB, nullable=False)
    mode: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    __table_args__ = (
        CheckConstraint("mode IN ('sandbox', 'live')", name="ck_scores_mode"),
    )