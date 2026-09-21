"""Document loader.

Reads the curated sustainability corpus from disk. Each file is Markdown with a
small ``---`` delimited header so provenance travels with the text — every claim
the assistant makes can be traced back to a named publisher.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from app.core.config import KNOWLEDGE_DIR
from app.core.logging import get_logger

logger = get_logger(__name__)

HEADER_DELIMITER = "---"


@dataclass(frozen=True)
class Document:
    """One source document, with the provenance needed for citation."""

    doc_id: str
    title: str
    publisher: str
    document_type: str
    url: str | None
    topics: tuple[str, ...]
    text: str


def parse_header(raw: str) -> tuple[dict[str, str], str]:
    """Split a ``key: value`` header block from the Markdown body.

    Returns the metadata and the remaining body. Files without a header are
    treated as body-only rather than rejected, so a dropped-in note still works.
    """
    lines = raw.splitlines()
    if not lines or lines[0].strip() != HEADER_DELIMITER:
        return {}, raw

    meta: dict[str, str] = {}
    for index, line in enumerate(lines[1:], start=1):
        if line.strip() == HEADER_DELIMITER:
            body = "\n".join(lines[index + 1 :]).strip()
            return meta, body

        key, separator, value = line.partition(":")
        if separator:
            meta[key.strip().lower()] = value.strip()

    # Unterminated header — treat the whole file as content.
    return {}, raw


def _as_topics(value: str | None) -> tuple[str, ...]:
    if not value:
        return ()
    return tuple(part.strip().lower() for part in value.split(",") if part.strip())


def load_documents(directory: Path | None = None) -> list[Document]:
    """Load every ``*.md`` file in the knowledge directory (sorted for stability)."""
    directory = directory or KNOWLEDGE_DIR

    if not directory.is_dir():
        logger.warning("Knowledge directory not found: %s", directory)
        return []

    documents: list[Document] = []

    for path in sorted(directory.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        meta, body = parse_header(raw)

        if not body:
            logger.warning("Skipping empty document: %s", path.name)
            continue

        documents.append(
            Document(
                doc_id=path.stem,
                title=meta.get("title", path.stem.replace("-", " ").title()),
                publisher=meta.get("publisher", "Unspecified"),
                document_type=meta.get("document_type", "guidance"),
                url=meta.get("url") or None,
                topics=_as_topics(meta.get("topics")),
                text=body,
            )
        )

    logger.info("Loaded %d knowledge documents from %s", len(documents), directory)
    return documents
