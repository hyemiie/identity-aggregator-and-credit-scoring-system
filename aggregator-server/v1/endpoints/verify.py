from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from db.models import Verification
from models.schemas import VerifyRequest, VerifyResponse
from providers.factory import get_provider
from core.auth import get_current_api_key, APIKeyContext

router = APIRouter()


@router.post("/verify", response_model=VerifyResponse)
async def verify_identity(
    payload: VerifyRequest,
    db: AsyncSession = Depends(get_db),
    api_key: APIKeyContext = Depends(get_current_api_key),
) -> VerifyResponse:
    provider = get_provider(payload.identity_type, mode=api_key.mode)
    result = await provider.verify(payload.identity_type, payload.identifier)

    verification = Verification(
        developer_id=api_key.developer_id,
        identity_type=payload.identity_type,
        identifier_last4=result.identifier_last4,
        provider_used=result.provider_used,
        status=result.status,
        name_matched=result.name_matched,
        dob_matched=result.dob_matched,
        confidence_score=result.confidence_score,
        error_code=result.error_code,
        mode=api_key.mode,
    )

    db.add(verification)
    await db.commit()
    await db.refresh(verification)

    return VerifyResponse.model_validate(verification)