"""Retrieval-augmented generation.

Pipeline: load → chunk → embed → store → retrieve → build context.

Each stage is a separate, replaceable module so the lightweight default
(TF-IDF over an in-memory index) can be swapped for a heavier embedding model or
an external vector database without touching the API layer.
"""
