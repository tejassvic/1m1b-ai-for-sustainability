"""Chunking.

Splits a document along its ``##`` headings first, then windows any section that
is still too long. Heading-aware chunking keeps each passage coherent, which
matters more for retrieval quality than the exact window size.
"""

from __future__ import annotations

from dataclasses import dataclass
from re import compile as compile_pattern

from .loader import Document

HEADING_PATTERN = compile_pattern(r"^##+\s+(.*)$")

DEFAULT_CHUNK_SIZE = 900
DEFAULT_OVERLAP = 150


@dataclass(frozen=True)
class Chunk:
    """A retrievable passage, carrying the metadata needed to cite it."""

    chunk_id: str
    doc_id: str
    title: str
    publisher: str
    document_type: str
    url: str | None
    topics: tuple[str, ...]
    heading: str
    index: int
    text: str


def _split_sections(text: str) -> list[tuple[str, str]]:
    """Group the body into ``(heading, content)`` pairs."""
    sections: list[tuple[str, str]] = []
    heading = ""
    buffer: list[str] = []

    for line in text.splitlines():
        match = HEADING_PATTERN.match(line)
        if match:
            body = "\n".join(buffer).strip()
            if body:
                sections.append((heading, body))
            heading = match.group(1).strip()
            buffer = []
        else:
            buffer.append(line)

    tail = "\n".join(buffer).strip()
    if tail:
        sections.append((heading, tail))

    return sections or [("", text.strip())]


def _window(text: str, size: int, overlap: int) -> list[str]:
    """Slide a window over long text, preferring paragraph boundaries."""
    if len(text) <= size:
        return [text]

    step = max(size - overlap, 1)
    pieces: list[str] = []

    for start in range(0, len(text), step):
        piece = text[start : start + size].strip()
        if piece:
            pieces.append(piece)
        if start + size >= len(text):
            break

    return pieces


def chunk_document(
    document: Document,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> list[Chunk]:
    """Turn one document into an ordered list of passages."""
    chunks: list[Chunk] = []

    for heading, content in _split_sections(document.text):
        for piece in _window(content, chunk_size, overlap):
            index = len(chunks)
            # Prefixing the heading keeps short passages self-describing once
            # they are retrieved in isolation.
            text = f"{document.title} — {heading}\n{piece}" if heading else f"{document.title}\n{piece}"

            chunks.append(
                Chunk(
                    chunk_id=f"{document.doc_id}#{index}",
                    doc_id=document.doc_id,
                    title=document.title,
                    publisher=document.publisher,
                    document_type=document.document_type,
                    url=document.url,
                    topics=document.topics,
                    heading=heading,
                    index=index,
                    text=text,
                )
            )

    return chunks


def chunk_documents(
    documents: list[Document],
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> list[Chunk]:
    chunks: list[Chunk] = []
    for document in documents:
        chunks.extend(chunk_document(document, chunk_size, overlap))
    return chunks
