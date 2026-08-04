from __future__ import annotations

import logging
from typing import Protocol

from etl.dtos import MatchGroup, NormalizedLocation
from etl.merge.config import MergeConfig

logger = logging.getLogger(__name__)


class Merger(Protocol):
    def merge(self, groups: list[MatchGroup], fields_filled: dict[str, int]) -> list[NormalizedLocation]:
        """Merges properties of location groups into single normalized locations.

        Args:
            groups: A list of matched groups of locations from different sources.
            fields_filled: A dictionary tracking how often fields were filled.

        Returns:
            A list of merged and deduplicated locations.

        Examples:
            >>> class MyMerger:
            ...     def merge(self, g, f): return []
            >>> MyMerger().merge([], {})
            []
        """
        ...


class PriorityFillMerger:
    """Merges by starting with highest-priority source, filling gaps from others."""

    def __init__(self, config: MergeConfig):
        self.config = config

    def merge(self, groups: list[MatchGroup], fields_filled: dict[str, int]) -> list[NormalizedLocation]:
        merged: list[NormalizedLocation] = []

        for group in groups:
            # Sort sources by priority
            ordered_sources = sorted(
                group.keys(),
                key=lambda s: self.config.source_priority.index(s)
                if s in self.config.source_priority
                else len(self.config.source_priority),
            )

            # Start with the highest-priority record as the base
            base = group[ordered_sources[0]].model_copy(deep=True)

            # Fill gaps from other sources
            for source in ordered_sources[1:]:
                other = group[source]

                # Name
                if not base.name or base.name == base.data_source_id:
                    base.name = other.name

                # Address
                if not base.address.street and other.address.street:
                    base.address.street = other.address.street
                    logger.debug("Filled 'address.street' from %s for '%s'", source, base.name)
                    fields_filled["address.street"] = fields_filled.get("address.street", 0) + 1
                    
                if not base.address.city and other.address.city:
                    base.address.city = other.address.city
                if not base.address.state and other.address.state:
                    base.address.state = other.address.state
                if not base.address.postcode and other.address.postcode:
                    base.address.postcode = other.address.postcode

                # Contact
                if not base.contact.phone and other.contact.phone:
                    base.contact.phone = other.contact.phone
                    logger.debug("Filled 'phone' from %s for '%s'", source, base.name)
                    fields_filled["contact.phone"] = fields_filled.get("contact.phone", 0) + 1
                    
                if not base.contact.website and other.contact.website:
                    base.contact.website = other.contact.website
                if not base.contact.email and other.contact.email:
                    base.contact.email = other.contact.email

                # Availability
                if not base.availability.opening_hours and other.availability.opening_hours:
                    base.availability.opening_hours = other.availability.opening_hours
                    logger.debug("Filled 'hours' from %s for '%s'", source, base.name)
                    fields_filled["availability.opening_hours"] = fields_filled.get("availability.opening_hours", 0) + 1

                # Services: union of unique activities
                existing_activities = {(s.activity, s.item_category) for s in base.services}
                for svc in other.services:
                    if (svc.activity, svc.item_category) not in existing_activities:
                        base.services.append(svc.model_copy(deep=True))
                        existing_activities.add((svc.activity, svc.item_category))

                # Rating: prefer the one with more reviews
                if other.rating is not None:
                    if base.rating is None or (other.review_count or 0) > (base.review_count or 0):
                        base.rating = other.rating
                        base.review_count = other.review_count

                # Coordinates: prefer non-zero
                if (base.lat == 0.0 or base.lon == 0.0) and other.lat != 0.0:
                    base.lat = other.lat
                    base.lon = other.lon

            merged.append(base)

        return merged
