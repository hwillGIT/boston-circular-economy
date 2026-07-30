from __future__ import annotations

import logging

from etl.base.data_store import BaseDataStore
from etl.dtos import NormalizedLocation
from etl.merge.config import MergeConfig
from etl.merge.matcher import GeoNameMatcher
from etl.merge.merger import PriorityFillMerger
from etl.merge.result import MergeResult

logger = logging.getLogger(__name__)


class MergeProcessor:
    def __init__(self, store: BaseDataStore, config: MergeConfig | None = None):
        self.store = store
        self.config = config or MergeConfig()
        self.matcher = GeoNameMatcher(self.config)
        self.merger = PriorityFillMerger(self.config)

    def process(self) -> MergeResult:
        """Run the full match-merge pipeline."""
        locations_by_source: dict[str, list[NormalizedLocation]] = {}
        total_input = 0
        sources_read = []

        # Read snapshots for all configured priorities
        for source in self.config.source_priority:
            try:
                locs = self.store.read_source_snapshot(source)
                if locs:
                    locations_by_source[source] = locs
                    total_input += len(locs)
                    sources_read.append(source)
            except Exception as e:
                logger.debug("Could not read snapshot for source %s: %s", source, e)

        if not locations_by_source:
            logger.warning("No locations found in any source.")
            return MergeResult(
                total_input=0,
                total_output=0,
                matched_groups=0,
                unmatched=0,
                sources_read=tuple(),
            )

        match_groups = self.matcher.match(locations_by_source)

        matched_groups_count = sum(1 for g in match_groups if len(g) > 1)
        unmatched_count = sum(1 for g in match_groups if len(g) == 1)

        fields_filled: dict[str, int] = {}
        merged_locations = self.merger.merge(match_groups, fields_filled)

        self.store.write_output_locations(merged_locations)

        result = MergeResult(
            total_input=total_input,
            total_output=len(merged_locations),
            matched_groups=matched_groups_count,
            unmatched=unmatched_count,
            sources_read=tuple(sources_read),
            fields_filled=fields_filled,
        )

        logger.info(
            "Merge complete: %d records from %d sources → %d merged (%d matched groups, %d unique, %s gap-fills)",
            result.total_input,
            len(sources_read),
            result.total_output,
            result.matched_groups,
            result.unmatched,
            ", ".join(f"{k}={v}" for k, v in result.fields_filled.items()) or "none",
        )

        return result
