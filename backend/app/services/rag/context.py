"""Context builder.

Turns retrieved passages into (a) the text handed to the language model and
(b) the source list handed back to the reader. Only the fields a reader needs
are ever passed on — the raw corpus record is never forwarded wholesale.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.schemas.chat import SourceRef

from .store import ScoredChunk

MAX_CONTEXT_CHARS = 4500
EXCERPT_CHARS = 300


@dataclass
class BuiltContext:
    """The grounded material for one answer."""

    prompt_context: str
    sources: list[SourceRef] = field(default_factory=list)
    passages_used: int = 0

    @property
    def is_empty(self) -> bool:
        return self.passages_used == 0


def _condense(text: str, limit: int = EXCERPT_CHARS) -> str:
    """Flatten a passage into a short, single-line excerpt for display."""
    flattened = " ".join(text.split())
    if len(flattened) <= limit:
        return flattened
    return flattened[: limit - 1].rstrip() + "\u2026"


def build_context(results: list[ScoredChunk]) -> BuiltContext:
    """Assemble model context and citations from ranked passages."""
    if not results:
        return BuiltContext(prompt_context="", sources=[], passages_used=0)

    blocks: list[str] = []
    sources: list[SourceRef] = []
    seen_documents: set[str] = set()
    budget = MAX_CONTEXT_CHARS
    used = 0

    for rank, result in enumerate(results, start=1):
        chunk = result.chunk

        block = (
            f"[{rank}] {chunk.title}\n"
            f"Publisher: {chunk.publisher}\n"
            f"Section: {chunk.heading or 'Overview'}\n"
            f"{chunk.text}\n"
        )

        if len(block) > budget:
            break

        blocks.append(block)
        budget -= len(block)
        used += 1

        # One citation per document, keeping the strongest match's excerpt.
        if chunk.doc_id not in seen_documents:
            seen_documents.add(chunk.doc_id)
            sources.append(
                SourceRef(
                    title=chunk.title,
                    publisher=chunk.publisher,
                    document_type=chunk.document_type,
                    url=chunk.url,
                    excerpt=_condense(chunk.text.replace(chunk.title, "", 1)),
                    relevance=round(result.score, 4),
                )
            )

    separator = "\n" + ("-" * 68) + "\n"
    return BuiltContext(
        prompt_context=separator.join(blocks),
        sources=sources,
        passages_used=used,
    )
