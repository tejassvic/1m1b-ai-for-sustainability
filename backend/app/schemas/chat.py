"""Schemas for the Ask Verdant conversational endpoint."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from .impact import ImpactRequest

Role = Literal["user", "assistant"]

DISCLAIMER = (
    "Verdant responses are AI-generated explanations grounded in the sources "
    "listed above. They are guidance, not official environmental advice."
)


class ChatTurn(BaseModel):
    """One previous message, replayed to give the model conversational context."""

    role: Role
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=1200)
    history: list[ChatTurn] = Field(default_factory=list, max_length=12)

    # Optional: the visitor's own Impact Analyzer inputs. The server recomputes
    # the figures from these rather than accepting any numbers from the client,
    # so a model can never be handed an unverified total to explain.
    impact: ImpactRequest | None = None

    # Optional location context. Accepted so a future build can attach local
    # hazard information, but it is never stored or used to identify anyone.
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)


class SourceRef(BaseModel):
    """A retrieved document, cited so the answer can be verified."""

    title: str
    publisher: str
    document_type: str
    url: str | None = None
    excerpt: str = ""
    relevance: float = Field(ge=0.0, le=1.0)


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceRef] = Field(default_factory=list)
    actions: list[str] = Field(default_factory=list)
    grounded: bool = True
    provider: str
    model: str | None = None
    disclaimer: str = DISCLAIMER
