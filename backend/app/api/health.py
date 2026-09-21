"""Health and transparency endpoints.

``/health`` is deliberately informative rather than a bare ``{"ok": true}``: it
reports how many sources are loaded and which language model is answering. A
platform that asks to be trusted about environmental claims should be willing to
say what is actually running.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import get_settings
from app.services.impact.catalogue import catalogue_topics
from app.services.llm.factory import provider_status
from app.services.rag.index import get_index

router = APIRouter(tags=["system"])


@router.get("/health", summary="Service, retrieval and model status")
def health() -> dict[str, object]:
    settings = get_settings()

    try:
        index_stats = get_index().stats()
        knowledge_ok = True
    except Exception as error:  # noqa: BLE001 — health must always answer
        index_stats = {"error": str(error)}
        knowledge_ok = False

    return {
        "status": "ok" if knowledge_ok else "degraded",
        "service": settings.app_name,
        "version": settings.version,
        "knowledge": index_stats,
        "language_model": provider_status(),
        "recommendation_topics": catalogue_topics(),
    }
