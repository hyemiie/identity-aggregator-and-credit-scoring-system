import hashlib
import uuid
from dataclasses import dataclass

from fastapi import Depends, Security
from fastapi.security import APIKeyHeader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.errors import UnauthorizedError
from db.models import APIKey
from db.session import get_db

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


@dataclass
class APIKeyContext:
    developer_id: uuid.UUID
    mode: str  # 'sandbox' | 'live'


def hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode()).hexdigest()


async def get_current_api_key(
    raw_key: str | None = Security(api_key_header),
    db: AsyncSession = Depends(get_db),
) -> APIKeyContext:
    if not raw_key:
        raise UnauthorizedError("Missing API key")

    key_hash = hash_api_key(raw_key)

    result = await db.execute(
        select(APIKey).where(APIKey.key_hash == key_hash, APIKey.is_active == True)
    )
    api_key = result.scalar_one_or_none()

    if api_key is None:
        raise UnauthorizedError("Invalid or inactive API key")

    return APIKeyContext(developer_id=api_key.developer_id, mode=api_key.mode)