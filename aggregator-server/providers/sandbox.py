from providers.base import BaseIdentityProvider, NormalizedVerificationResult


class SandboxAdapter(BaseIdentityProvider):
    provider_name = "sandbox"

    def supports(self, identity_type: str) -> bool:
        return identity_type in {"BVN", "NIN", "CAC", "GHANA_CARD"}

    async def verify(self, identity_type: str, identifier: str) -> NormalizedVerificationResult:
        record = _FAKE_RECORDS.get(identifier)

        if record is None:
            return NormalizedVerificationResult(
                status="failed",
                provider_used="sandbox",
                name_matched=False,
                dob_matched=False,
                confidence_score=0.0,
                identifier_last4=identifier[-4:] if len(identifier) >= 4 else identifier,
                raw_response={"note": "no matching sandbox record"},
                error_code="verification_failed",
            )

        return NormalizedVerificationResult(
            status=record["status"],
            provider_used="sandbox",
            name_matched=record["name_matched"],
            dob_matched=record["dob_matched"],
            confidence_score=record["confidence_score"],
            identifier_last4=identifier[-4:],
            raw_response=record,
            error_code=None if record["status"] == "verified" else "verification_failed",
        )


_FAKE_RECORDS = {
    "22222222222": {"status": "verified", "name_matched": True, "dob_matched": True, "confidence_score": 0.98},
    "11111111111": {"status": "failed", "name_matched": False, "dob_matched": True, "confidence_score": 0.42},
    "GHA-000000000-0": {"status": "verified", "name_matched": True, "dob_matched": True, "confidence_score": 0.95},
}