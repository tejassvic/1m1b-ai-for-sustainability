"""Small shared text helpers.

Kept in one place so retrieval ranking and extractive summarisation agree on
what counts as a content word — otherwise the two stages would quietly disagree
about relevance.
"""

from __future__ import annotations

from re import compile as compile_pattern

TOKEN_PATTERN = compile_pattern(r"[a-z0-9]+")
SENTENCE_PATTERN = compile_pattern(r"(?<=[.!?])\s+")

#: A compact stop list. Enough to keep ranking focused on nouns and verbs
#: without pulling in a corpus-derived list for a corpus this size.
STOPWORDS = frozenset(
    """
    a an and are as at be but by can could do does did doing for from how i if
    in into is it its me my of on or our should so than that the their them then
    there these they this to too us very was we were what when where which who
    why will with you your
    """.split()
)


def content_tokens(text: str) -> set[str]:
    """Lowercase content words used for overlap scoring."""
    return {
        token
        for token in TOKEN_PATTERN.findall(text.lower())
        if token not in STOPWORDS and len(token) > 1
    }


def split_sentences(text: str) -> list[str]:
    """Split prose into sentences, discarding empties."""
    return [part.strip() for part in SENTENCE_PATTERN.split(text.strip()) if part.strip()]


def normalise(text: str) -> str:
    """Collapse whitespace and lowercase, for de-duplication."""
    return " ".join(text.lower().split())


#: How many leading characters two words must share to count as the same term.
#: Five is the smallest value that matches plurals and close word families
#: ("campus"/"campuses", "reduce"/"reduction") while keeping unrelated words
#: apart ("conservation"/"consumption" diverge at the fifth character).
PREFIX_LENGTH = 5


def _same_term(left: str, right: str) -> bool:
    if left == right:
        return True
    if len(left) < PREFIX_LENGTH or len(right) < PREFIX_LENGTH:
        return False
    return left[:PREFIX_LENGTH] == right[:PREFIX_LENGTH]


def token_overlap(query_tokens: set[str], candidate_tokens: set[str]) -> float:
    """Fraction of query terms present in a candidate, tolerating word endings.

    A curator writes "campuses" and a visitor types "campus"; a bag-of-words
    index sees two unrelated strings. Prefix matching at a fixed length recovers
    most such pairs without stemming the corpus or adding a dependency.
    """
    if not query_tokens:
        return 0.0

    matched = 0
    for query_token in query_tokens:
        if any(_same_term(query_token, candidate) for candidate in candidate_tokens):
            matched += 1

    return matched / len(query_tokens)
