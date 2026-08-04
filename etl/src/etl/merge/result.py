from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class MergeResult:
    total_input: int  # Total records across all sources
    total_output: int  # Records after dedup
    matched_groups: int  # Groups with 2+ sources
    unmatched: int  # Locations only in one source
    sources_read: tuple[str, ...]
    fields_filled: dict[str, int] = field(default_factory=dict)  # Count of gap-fills per field
