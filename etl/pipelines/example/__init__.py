"""
Example ETL pipeline package.

This package is a guide for adding a new data source:
1. The querier fetches source-shaped data and wraps it in RawLocation objects.
2. The normalizer maps that source-shaped data into the shared schema.
3. A shared ingester, such as JSONIngester, persists the normalized records.

The example package intentionally keeps persistence out of this folder.
Use it to understand the fetch -> normalize part of the pipeline first.
"""

from pipelines.example.normalizer import ExampleNormalizer
from pipelines.example.querier import ExampleQuerier

__all__ = [
    "ExampleNormalizer",
    "ExampleQuerier",
]