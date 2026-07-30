from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class MergeConfig:
    match_radius_m: float = 50.0  # Max distance for same-location match
    name_similarity_threshold: float = 0.6  # Minimum similarity ratio
    source_priority: tuple[str, ...] = ("google_places", "bcyf", "openstreetmap")
