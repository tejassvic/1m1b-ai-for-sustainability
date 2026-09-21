"""IBM Granite served locally through Ollama.

Useful when a demonstration has to run without cloud credentials, or offline.
Enable with ``OLLAMA_ENABLED=true`` after ``ollama pull granite3.2``.
"""

from __future__ import annotations

import httpx

from app.core.config import Settings
from app.core.logging import get_logger

from .base import GenerationRequest, LLMError, LLMProvider

logger = get_logger(__name__)


class OllamaGraniteProvider(LLMProvider):
    """Generate text with a Granite model running on a local Ollama server."""

    name = "ollama-granite"
    is_generative = True

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.model = settings.ollama_model
        self._client = httpx.Client(timeout=settings.llm_timeout_seconds)

    @property
    def _base_url(self) -> str:
        return self._settings.ollama_base_url.rstrip("/")

    def is_reachable(self) -> bool:
        """Cheap liveness probe, used by the health endpoint."""
        try:
            return self._client.get(f"{self._base_url}/api/tags").status_code == 200
        except httpx.HTTPError:
            return False

    def generate(self, request: GenerationRequest) -> str:
        messages = [{"role": "system", "content": request.system}]
        messages.extend({"role": turn.role, "content": turn.content} for turn in request.messages)

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": self._settings.llm_temperature,
                "num_predict": self._settings.llm_max_tokens,
            },
        }

        try:
            response = self._client.post(f"{self._base_url}/api/chat", json=payload)
        except httpx.HTTPError as error:
            raise LLMError(f"Could not reach the Ollama server: {error}") from error

        if response.status_code == 404:
            raise LLMError(
                f"Ollama does not have the model '{self.model}'. "
                f"Run: ollama pull {self.model}"
            )

        if response.status_code != 200:
            raise LLMError(
                f"Ollama returned HTTP {response.status_code}: {response.text[:300]}"
            )

        content = (response.json().get("message") or {}).get("content", "")
        if not content.strip():
            raise LLMError("Ollama returned an empty completion")

        return content.strip()
