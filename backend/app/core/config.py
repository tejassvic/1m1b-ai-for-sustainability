"""Configuration.

Values are read from the environment, optionally seeded from a local `.env`
file. The loader and accessors are hand-rolled on purpose: this platform argues
for sustainable engineering, so it should not pull a settings framework in to
read eight strings.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

# backend/  →  parents[2] walks up from app/core/config.py
BACKEND_DIR = Path(__file__).resolve().parents[2]
KNOWLEDGE_DIR = BACKEND_DIR / "app" / "data" / "knowledge"
DOTENV_PATH = BACKEND_DIR / ".env"

PROVIDERS = ("auto", "watsonx", "ollama", "grounded")


def load_dotenv(path: Path = DOTENV_PATH) -> None:
    """Seed ``os.environ`` from a simple ``KEY=VALUE`` file.

    Real environment variables always win, so container/platform configuration
    is never silently overridden by a stray file on disk.
    """
    if not path.is_file():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


def _text(name: str, default: str) -> str:
    return os.environ.get(name, "").strip() or default


def _flag(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None or not raw.strip():
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _number(name: str, default: float, cast):
    raw = os.environ.get(name, "").strip()
    if not raw:
        return cast(default)
    try:
        return cast(raw)
    except (TypeError, ValueError):
        return cast(default)


def _sequence(name: str, default: tuple[str, ...]) -> list[str]:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return list(default)
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    """Immutable, validated view of the environment."""

    app_name: str = "Verdant AI API"
    version: str = "1.0.0"
    api_prefix: str = "/api/v1"

    cors_origins: list[str] = field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )

    # --- Language model -----------------------------------------------------
    llm_provider: str = "auto"
    llm_temperature: float = 0.2
    llm_max_tokens: int = 900
    llm_timeout_seconds: float = 60.0

    # IBM Granite via watsonx.ai
    watsonx_api_key: str = ""
    watsonx_project_id: str = ""
    watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
    watsonx_model_id: str = "ibm/granite-3-8b-instruct"

    # Granite via a local Ollama server
    ollama_enabled: bool = False
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "granite3.2:latest"

    # --- Retrieval ----------------------------------------------------------
    retrieval_top_k: int = 4
    chunk_size: int = 900
    chunk_overlap: int = 150
    min_similarity: float = 0.05

    @property
    def watsonx_configured(self) -> bool:
        return bool(self.watsonx_api_key and self.watsonx_project_id)

    @property
    def resolved_provider(self) -> str:
        """Turn ``auto`` into a concrete provider name.

        Resolution is deliberately explicit rather than a network probe, so a
        health check never blocks on an unreachable host.
        """
        if self.llm_provider != "auto":
            return self.llm_provider
        if self.watsonx_configured:
            return "watsonx"
        if self.ollama_enabled:
            return "ollama"
        return "grounded"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load settings once per process."""
    load_dotenv()

    provider = _text("LLM_PROVIDER", "auto").lower()
    if provider not in PROVIDERS:
        provider = "auto"

    return Settings(
        cors_origins=_sequence(
            "VERDANT_CORS_ORIGINS",
            ("http://localhost:5173", "http://127.0.0.1:5173"),
        ),
        llm_provider=provider,
        llm_temperature=_number("LLM_TEMPERATURE", 0.2, float),
        llm_max_tokens=_number("LLM_MAX_TOKENS", 900, int),
        llm_timeout_seconds=_number("LLM_TIMEOUT_SECONDS", 60.0, float),
        watsonx_api_key=_text("WATSONX_API_KEY", ""),
        watsonx_project_id=_text("WATSONX_PROJECT_ID", ""),
        watsonx_url=_text("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
        watsonx_model_id=_text("WATSONX_MODEL_ID", "ibm/granite-3-8b-instruct"),
        ollama_enabled=_flag("OLLAMA_ENABLED", False),
        ollama_base_url=_text("OLLAMA_BASE_URL", "http://localhost:11434"),
        ollama_model=_text("OLLAMA_MODEL", "granite3.2:latest"),
        retrieval_top_k=_number("RETRIEVAL_TOP_K", 4, int),
        chunk_size=_number("CHUNK_SIZE", 900, int),
        chunk_overlap=_number("CHUNK_OVERLAP", 150, int),
        min_similarity=_number("MIN_SIMILARITY", 0.05, float),
    )
