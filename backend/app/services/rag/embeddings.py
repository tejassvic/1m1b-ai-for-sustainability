"""Embeddings.

The default model is TF-IDF with word n-grams. That is a deliberate choice: it
is a genuine vector representation, it is deterministic, it trains in
milliseconds on a corpus this size, and it downloads nothing. A dense
transformer model can be substituted by implementing the same two methods.
"""

from __future__ import annotations

from typing import Protocol, Sequence

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize


class EmbeddingModel(Protocol):
    """Minimal contract every embedding implementation must satisfy."""

    name: str
    dimensions: int

    def fit(self, texts: Sequence[str]) -> "EmbeddingModel": ...

    def encode(self, texts: Sequence[str]) -> np.ndarray: ...


class TfidfEmbeddingModel:
    """Sparse lexical embeddings, returned as L2-normalised float32 rows.

    Because every row is unit length, cosine similarity reduces to a dot
    product — which in turn reduces search to a single matrix multiplication.
    """

    name = "tfidf-lexical-v1"

    def __init__(self, ngram_range: tuple[int, int] = (1, 2), min_df: int = 1) -> None:
        self._vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=ngram_range,
            min_df=min_df,
            sublinear_tf=True,
        )
        self.dimensions = 0
        self._fitted = False

    def fit(self, texts: Sequence[str]) -> "TfidfEmbeddingModel":
        matrix = self._vectorizer.fit_transform(texts)
        self.dimensions = matrix.shape[1]
        self._fitted = True
        return self

    def encode(self, texts: Sequence[str]) -> np.ndarray:
        if not self._fitted:
            raise RuntimeError("EmbeddingModel.encode() called before fit()")
        if not texts:
            return np.zeros((0, self.dimensions), dtype=np.float32)

        matrix = self._vectorizer.transform(texts)
        return normalize(matrix, norm="l2", copy=False).astype(np.float32).toarray()
