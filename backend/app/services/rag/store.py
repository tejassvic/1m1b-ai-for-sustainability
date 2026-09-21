"""Vector store.

An in-memory matrix of normalised embeddings plus the passages they describe.
Small enough to hold entirely in RAM, so search is a single dot product and
needs no external service.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from .chunker import Chunk
from .embeddings import EmbeddingModel


@dataclass(frozen=True)
class ScoredChunk:
    """A passage and its similarity to the query, in ``[0, 1]``."""

    chunk: Chunk
    score: float


class VectorStore:
    """Brute-force cosine similarity over a fixed corpus."""

    def __init__(self, chunks: list[Chunk], embedder: EmbeddingModel) -> None:
        if not chunks:
            raise ValueError("VectorStore requires at least one chunk")

        self._chunks = chunks
        self._embedder = embedder
        self._matrix = embedder.encode([chunk.text for chunk in chunks])

    @classmethod
    def build(cls, chunks: list[Chunk], embedder: EmbeddingModel) -> "VectorStore":
        """Fit the embedder on the corpus, then index it."""
        embedder.fit([chunk.text for chunk in chunks])
        return cls(chunks, embedder)

    def __len__(self) -> int:
        return len(self._chunks)

    @property
    def embedder_name(self) -> str:
        return self._embedder.name

    @property
    def dimensions(self) -> int:
        return self._embedder.dimensions

    def search(self, query: str, top_k: int = 4) -> list[ScoredChunk]:
        """Return the ``top_k`` most similar passages, best first."""
        query = query.strip()
        if not query or top_k <= 0:
            return []

        vector = self._embedder.encode([query])[0]
        similarities = self._matrix @ vector

        # Slicing the argsort to top_k keeps this O(n) beyond the sort itself.
        k = min(top_k, len(self._chunks))
        best = np.argpartition(-similarities, k - 1)[:k]
        best = best[np.argsort(-similarities[best])]

        return [
            ScoredChunk(chunk=self._chunks[index], score=float(similarities[index]))
            for index in best
        ]
