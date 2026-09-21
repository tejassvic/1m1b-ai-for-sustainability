"""Provider selection.

``auto`` resolves to IBM Granite on watsonx.ai when credentials exist, then to a
local Ollama server when explicitly enabled, and finally to the grounded
extractive responder. That ordering means the platform works on a laptop with no
credentials at all, and upgrades silently the moment real credentials appear.
"""

from __future__ import annotations

from functools import lru_cache

from app.core.config import Settings, get_settings
from app.core.logging import get_logger

from .base import LLMError, LLMProvider
from .granite import WatsonxGraniteProvider
from .grounded import GroundedProvider
from .ollama import OllamaGraniteProvider

logger = get_logger(__name__)


def _construct(provider: str, settings: Settings) -> LLMProvider:
    if provider == "watsonx":
        return WatsonxGraniteProvider(settings)
    if provider == "ollama":
        return OllamaGraniteProvider(settings)
    return GroundedProvider()


def create_provider(settings: Settings | None = None) -> LLMProvider:
    """Build the provider named by settings, degrading safely on failure."""
    settings = settings or get_settings()
    wanted = settings.resolved_provider

    try:
        provider = _construct(wanted, settings)
        logger.info("Language model provider: %s (%s)", provider.name, provider.model)
        return provider
    except LLMError as error:
        logger.warning("Provider '%s' unavailable (%s) — falling back", wanted, error)
        return GroundedProvider()
    except Exception as error:  # noqa: BLE001 — a demo must never fail to start
        logger.warning("Provider '%s' failed to initialise (%s) — falling back", wanted, error)
        return GroundedProvider()


@lru_cache(maxsize=1)
def get_provider() -> LLMProvider:
    """Process-wide provider singleton."""
    return create_provider()


def provider_status() -> dict[str, object]:
    """Describe the active provider, for the health endpoint."""
    settings = get_settings()
    provider = get_provider()

    return {
        "configured": settings.llm_provider,
        "resolved": settings.resolved_provider,
        "active": provider.name,
        "model": provider.model,
        "generative": provider.is_generative,
        "watsonx_credentials_present": settings.watsonx_configured,
    }
