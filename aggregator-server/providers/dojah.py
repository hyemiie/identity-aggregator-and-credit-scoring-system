from providers.base import BaseIdentityProvider, NormalizedVerificationResult
from core.errors import ProviderDownError


class DojahAdapter(BaseIdentityProvider):
    provider_name = "dojah"

    def supports(self, identity_type: str) -> bool:
        return identity_type in {"BVN", "NIN", "CAC"}

    async def verify(self, identity_type: str, identifier: str) -> NormalizedVerificationResult:
        raise ProviderDownError("Dojah adapter not yet implemented")