from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class NormalizedVerificationResult:
    """
    The ONE shape every adapter must return, regardless of what the
    underlying provider's raw response looks like. This is what makes
    the API 'provider agnostic' at the response level.
    """
    status: str                    # 'verified' | 'failed' | 'pending'
    provider_used: str              # 'dojah' | 'smile_id' | 'sandbox'
    name_matched: bool | None
    dob_matched: bool | None
    confidence_score: float | None
    identifier_last4: str | None
    raw_response: dict              # kept only transiently — see retention note below
    error_code: str | None = None


class BaseIdentityProvider(ABC):
    """
    Every provider adapter (Dojah, Smile ID, Sandbox, or any future
    provider) implements this interface. Nothing outside this file
    should ever know which concrete adapter it's talking to.
    """

    provider_name: str

    @abstractmethod
    async def verify(self, identity_type: str, identifier: str) -> NormalizedVerificationResult:
        """
        Calls the underlying provider and returns a NormalizedVerificationResult.
        Implementations should catch provider-specific exceptions and re-raise
        as one of the shared APIError subclasses (ProviderDownError,
        VerificationFailedError, InvalidInputError) — never let a raw
        httpx/requests exception escape this method.
        """
        raise NotImplementedError

    @abstractmethod
    def supports(self, identity_type: str) -> bool:
        """
        Lets the factory/router ask 'can this adapter even handle BVN?'
        before calling verify() — avoids routing a Ghana Card request
        to an adapter that only knows Nigeria, for example.
        """
        raise NotImplementedError