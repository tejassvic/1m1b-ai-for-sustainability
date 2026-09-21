"""Verdant API — application entry point.

Run locally with:

    uvicorn app.main:app --reload --port 8000

Startup deliberately warms the retrieval index and selects the language-model
provider, so the first real request a visitor makes is not the one that pays for
index construction.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api import chat, health, impact, recommendations
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.services.llm.factory import get_provider
from app.services.rag.index import get_index

settings = get_settings()

configure_logging()
logger = get_logger("app.main")

DESCRIPTION = """
Verdant is an AI sustainability assistant for individuals and communities.

It separates three responsibilities that are often blurred together:

* **Retrieval** — a curated sustainability corpus, indexed locally, cited in every answer.
* **Calculation** — emission estimates produced by deterministic arithmetic over fixed factors.
* **Explanation** — a language model that narrates the above and never invents a number.

Built for the AI for Sustainability track, with SDG 11, 12 and 13 as its focus.
"""


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Warm the index and resolve the model provider before serving traffic."""
    logger.info("Starting %s v%s", settings.app_name, settings.version)

    try:
        index = get_index()
        logger.info("Retrieval ready: %s chunks indexed", index.chunk_count)
    except RuntimeError as error:
        logger.error("Retrieval unavailable at startup: %s", error)

    provider = get_provider()
    logger.info("Answering with provider '%s'", provider.name)

    yield

    logger.info("Shutting down")


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=DESCRIPTION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(chat.router, prefix=settings.api_prefix)
app.include_router(impact.router, prefix=settings.api_prefix)
app.include_router(recommendations.router, prefix=settings.api_prefix)


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    """Send anyone who lands on the bare host to the interactive API docs."""
    return RedirectResponse(url="/docs")
