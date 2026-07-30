from __future__ import annotations

import string
from difflib import SequenceMatcher


def normalize_name(name: str) -> str:
    """Lowercase, strip common suffixes, remove punctuation for matching."""
    if not name:
        return ""
    n = name.lower().strip()
    for p in string.punctuation:
        n = n.replace(p, "")
    for suffix in (" inc", " llc", " corp", " co", " shop", " store", " center", " centre"):
        if n.endswith(suffix):
            n = n[: -len(suffix)].strip()
    return n.strip()


def name_similarity(a: str, b: str) -> float:
    """Ratio 0.0 to 1.0 using SequenceMatcher."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def is_name_match(a: str, b: str, threshold: float) -> bool:
    """Return True if normalized names match based on threshold or containment."""
    norm_a = normalize_name(a)
    norm_b = normalize_name(b)
    if not norm_a or not norm_b:
        return False
    if norm_a in norm_b or norm_b in norm_a or norm_a == norm_b:
        return True
    return name_similarity(norm_a, norm_b) >= threshold
