from providers.base import BaseIdentityProvider
from providers.sandbox import SandboxAdapter
from providers.dojah import DojahAdapter
from providers.smile_id import SmileIDAdapter


# Instantiated once at module load and reused across every request —
# avoids re-creating HTTP clients/connection pools per call.
_ADAPTERS: dict[str, BaseIdentityProvider] = {
    "sandbox": SandboxAdapter(),
    "dojah": DojahAdapter(),
    "smile_id": SmileIDAdapter(),
}


def get_provider(identity_type: str, mode: str) -> BaseIdentityProvider:
    """
    Selects the right adapter for a given identity_type and mode.

    - sandbox mode always routes to SandboxAdapter, regardless of identity_type
    - live mode asks each non-sandbox adapter 'do you support this?' and
      returns the first one that says yes

    This is the ONLY place in the codebase that knows provider names.
    Endpoint code just calls get_provider(...) and never mentions
    Dojah or Smile ID directly.
    """
    if mode == "sandbox":
        return _ADAPTERS["sandbox"]

    for name, adapter in _ADAPTERS.items():
        if name != "sandbox" and adapter.supports(identity_type):
            return adapter

    raise ValueError(f"No live provider available for identity_type={identity_type}")