"""Retriever.

Combines the dense-ish TF-IDF similarity with a light keyword boost over the
document metadata. The boost matters because short questions ("What is SDG 13?",
"water") carry little lexical mass for a bag-of-words model, yet their intent is
unambiguous from the title and topic tags.
"""

from __future__ import annotations

from app.services.text_utils import content_tokens, token_overlap

from .store import ScoredChunk, VectorStore


class Retriever:
    """Ranked retrieval over the knowledge index."""

    def __init__(
        self,
        store: VectorStore,
        top_k: int = 4,
        min_similarity: float = 0.05,
        keyword_weight: float = 0.35,
        max_per_document: int = 2,
    ) -> None:
        self._store = store
        self._top_k = top_k
        self._min_similarity = min_similarity
        self._keyword_weight = keyword_weight
        self._max_per_document = max_per_document

    def search(self, query: str, top_k: int | None = None) -> list[ScoredChunk]:
        """Return relevant passages, best first, filtered and de-duplicated."""
        requested = top_k or self._top_k
        # Over-fetch so that filtering and per-document caps can still be met.
        candidates = self._store.search(query, top_k=max(requested * 4, 12))

        query_tokens = content_tokens(query)
        ranked: list[ScoredChunk] = []

        for candidate in candidates:
            chunk = candidate.chunk
            metadata = " ".join((chunk.title, chunk.heading, " ".join(chunk.topics)))
            overlap = token_overlap(query_tokens, content_tokens(metadata))

            score = candidate.score + (self._keyword_weight * overlap)
            if score < self._min_similarity:
                continue

            ranked.append(ScoredChunk(chunk=chunk, score=min(score, 1.0)))

        ranked.sort(key=lambda item: item.score, reverse=True)

        # Keep the answer from resting on a single source.
        per_document: dict[str, int] = {}
        selected: list[ScoredChunk] = []

        for item in ranked:
            doc_id = item.chunk.doc_id
            if per_document.get(doc_id, 0) >= self._max_per_document:
                continue
            per_document[doc_id] = per_document.get(doc_id, 0) + 1
            selected.append(item)
            if len(selected) >= requested:
                break

        return selected
