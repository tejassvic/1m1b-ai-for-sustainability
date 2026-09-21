"""Knowledge index.

Builds the retrieval pipeline once per process and hands out a configured
``Retriever``. Everything is derived at startup from the files on disk, so the
index can never drift from its sources.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache

from app.core.config import Settings, get_settings
from app.core.logging import get_logger

from .chunker import chunk_documents
from .embeddings import TfidfEmbeddingModel
from .loader import load_documents
from .retriever import Retriever
from .store import VectorStore

logger = get_logger(__name__)


@dataclass
class KnowledgeIndex:
    """The assembled retrieval stack, plus the statistics a health check needs."""

    retriever: Retriever
    document_count: int
    chunk_count: int
    embedder_name: str
    dimensions: int
    topics: tuple[str, ...] = field(default_factory=tuple)

    def stats(self) -> dict[str, object]:
        return {
            "documents": self.document_count,
            "chunks": self.chunk_count,
            "embedder": self.embedder_name,
            "dimensions": self.dimensions,
            "topics": list(self.topics),
        }


def build_index(settings: Settings | None = None) -> KnowledgeIndex:
    """Load, chunk, embed and index the corpus."""
    settings = settings or get_settings()

    documents = load_documents()
    if not documents:
        raise RuntimeError(
            "The knowledge base is empty. Expected Markdown files in app/data/knowledge/."
        )

    chunks = chunk_documents(
        documents,
        chunk_size=settings.chunk_size,
        overlap=settings.chunk_overlap,
    )

    embedder = TfidfEmbeddingModel()
    store = VectorStore.build(chunks, embedder)

    logger.info(
        "Knowledge index ready — %d documents, %d chunks, %d dimensions",
        len(documents),
        len(chunks),
        store.dimensions,
    )

    topics: list[str] = []
    for document in documents:
        for topic in document.topics:
            if topic not in topics:
                topics.append(topic)

    return KnowledgeIndex(
        retriever=Retriever(
            store,
            top_k=settings.retrieval_top_k,
            min_similarity=settings.min_similarity,
        ),
        document_count=len(documents),
        chunk_count=len(chunks),
        embedder_name=store.embedder_name,
        dimensions=store.dimensions,
        topics=tuple(topics),
    )


@lru_cache(maxsize=1)
def get_index() -> KnowledgeIndex:
    """Process-wide singleton."""
    return build_index()
