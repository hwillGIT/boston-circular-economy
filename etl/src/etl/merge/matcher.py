from __future__ import annotations

import logging
from typing import Protocol

from etl.dtos import MatchGroup, NormalizedLocation
from etl.merge.config import MergeConfig
from etl.merge.geo import haversine_m
from etl.merge.similarity import is_name_match, name_similarity, normalize_name

logger = logging.getLogger(__name__)


class Matcher(Protocol):
    def match(self, locations_by_source: dict[str, list[NormalizedLocation]]) -> list[MatchGroup]:
        """Matches normalized locations from various sources into groups.

        Args:
            locations_by_source: A dictionary mapping source names to lists of locations.

        Returns:
            A list of match groups, each representing a single real-world entity.

        Examples:
            >>> class MyMatcher:
            ...     def match(self, locs): return []
            >>> MyMatcher().match({"src": []})
            []
        """
        ...


class GeoNameMatcher:
    """Matches locations by geographic proximity + name similarity."""

    def __init__(self, config: MergeConfig):
        self.config = config

    def match(self, locations_by_source: dict[str, list[NormalizedLocation]]) -> list[MatchGroup]:
        """
        Match businesses across sources by geographic proximity + name similarity.
        """
        tagged: list[tuple[str, NormalizedLocation]] = []
        for source, locs in locations_by_source.items():
            for loc in locs:
                tagged.append((source, loc))

        # Spatial indexing approach: sort by lat
        # This allows us to skip pairs that are too far apart in latitude alone
        tagged.sort(key=lambda item: item[1].lat)

        groups: list[MatchGroup] = []
        used: set[int] = set()

        # Latitude 1 degree is ~111,320 meters
        lat_threshold = self.config.match_radius_m / 111320.0

        for i, (src_i, loc_i) in enumerate(tagged):
            if i in used:
                continue
            group: MatchGroup = {src_i: loc_i}
            used.add(i)
            norm_name_i = normalize_name(loc_i.name)

            for j in range(i + 1, len(tagged)):
                if j in used:
                    continue

                src_j, loc_j = tagged[j]

                # Check latitude diff
                if loc_j.lat - loc_i.lat > lat_threshold:
                    break

                if src_j in group:
                    # Already have a record from this source in this group
                    continue

                dist = haversine_m(loc_i.lat, loc_i.lon, loc_j.lat, loc_j.lon)
                if dist > self.config.match_radius_m:
                    continue

                if is_name_match(loc_i.name, loc_j.name, self.config.name_similarity_threshold):
                    logger.debug(
                        "Matched '%s' (%s) with '%s' (%s) — distance: %dm, similarity: %.2f",
                        loc_i.name, src_i, loc_j.name, src_j, int(dist),
                        name_similarity(norm_name_i, normalize_name(loc_j.name)),
                    )
                    group[src_j] = loc_j
                    used.add(j)

            groups.append(group)

        return groups
