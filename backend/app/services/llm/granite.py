"""IBM Granite on watsonx.ai.

Talks to the watsonx.ai chat endpoint over HTTPS. An IAM bearer token is
exchanged from the API key and cached until shortly before it expires, so a
normal request costs one API call rather than two.
"""

from __future__ import annotations

import time

import httpx

from app.core.config import Settings
from app.core.logging import get_logger

from .base import GenerationRequest, LLMError, LLMProvider

logger = get_logger(__name__)

IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"
CHAT_API_VERSION = "2024-10-14"

# Refresh a little before expiry so a request never races the token lifetime.
TOKEN_SAFETY_MARGIN_SECONDS = 60.0


class WatsonxGraniteProvider(LLMProvider):
    """Generate text with an IBM Granite model deployed on watsonx.ai."""

    name = "watsonx-granite"
    is_generative = True

    def __init__(self, settings: Settings) -> None:
        if not settings.watsonx_configured:
            raise LLMError("watsonx.ai credentials are not configured")

        self._settings = settings
        self.model = settings.watsonx_model_id

        self._token: str | None = None
        self._token_expires_at: float = 0.0

        self._client = httpx.Client(timeout=settings.llm_timeout_seconds)

    # -- authentication -----------------------------------------------------

    def _access_token(self) -> str:
        now = time.monotonic()
        if self._token and now < self._token_expires_at:
            return self._token

        try:
            response = self._client.post(
                IAM_TOKEN_URL,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": self._settings.watsonx_api_key,
                },
            )
        except httpx.HTTPError as error:
            raise LLMError(f"Could not reach the IBM IAM token service: {error}") from error

        if response.status_code != 200:
            raise LLMError(
                f"IBM IAM rejected the API key (HTTP {response.status_code}). "
                "Check WATSONX_API_KEY."
            )

        payload = response.json()
        token = payload.get("access_token")
        if not token:
            raise LLMError("IBM IAM returned no access token")

        expires_in = float(payload.get("expires_in", 3600))
        self._token = token
        self._token_expires_at = now + max(expires_in - TOKEN_SAFETY_MARGIN_SECONDS, 30.0)
        return token

    # -- generation ---------------------------------------------------------

    def generate(self, request: GenerationRequest) -> str:
        conversation = [{"role": "system", "content": request.system}]
        conversation.extend(
            {"role": turn.role, "content": turn.content} for turn in request.messages
        )

        payload = {
            "model_id": self.model,
            "project_id": self._settings.watsonx_project_id,
            "messages": conversation,
            "parameters": {
                "temperature": self._settings.llm_temperature,
                "max_new_tokens": self._settings.llm_max_tokens,
            },
        }

        url = f"{self._settings.watsonx_url.rstrip('/')}/ml/v1/text/chat"

        try:
            response = self._client.post(
                url,
                params={"version": CHAT_API_VERSION},
                headers={
                    "Authorization": f"Bearer {self._access_token()}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                json=payload,
            )
        except httpx.HTTPError as error:
            raise LLMError(f"Could not reach watsonx.ai: {error}") from error

        if response.status_code == 401:
            # Token may have been revoked — clear it so the next call re-mints.
            self._token = None
            self._token_expires_at = 0.0
            raise LLMError("watsonx.ai rejected the request as unauthorised")

        if response.status_code != 200:
            raise LLMError(
                f"watsonx.ai returned HTTP {response.status_code}: {response.text[:300]}"
            )

        data = response.json()
        choices = data.get("choices") or []
        if not choices:
            raise LLMError("watsonx.ai returned no completion choices")

        content = (choices[0].get("message") or {}).get("content", "")
        if not content.strip():
            raise LLMError("watsonx.ai returned an empty completion")

        logger.debug("Granite completion via watsonx.ai (%d chars)", len(content))
        return content.strip()
