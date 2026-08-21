from providers.base import BaseIdentityProvider, NormalizedVerificationResult
from core.errors import ProviderDownError


class SmileIDAdapter(BaseIdentityProvider):
    provider_name = "smile_id"

    def supports(self, identity_type: str) -> bool:
        return identity_type == "GHANA_CARD"

    async def verify(self, identity_type: str, identifier: str) -> NormalizedVerificationResult:
        raise ProviderDownError("Smile ID adapter not yet implemented")