from __future__ import annotations

from base.normalizer import BaseNormalizer
from dtos import Activity, ItemCategory, NormalizedLocation, RawLocation
from pipelines.google_places.common import normalize_google_place


class GooglePlacesRepairNormalizer(BaseNormalizer):
    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Normalizes a list of raw shoe repair locations into normalized locations.

        Maps each raw Google Place payload to a NormalizedLocation with the
        item category set to SHOES and the activity set to REPAIR_PAID.

        Args:
            raw_locations: A list of RawLocation objects to be normalized.

        Returns:
            A list of NormalizedLocation objects.

        Examples:
            >>> normalizer = GooglePlacesRepairNormalizer()
            >>> locations = normalizer.normalize([])
            >>> len(locations)
            0
        """
        return [
            NormalizedLocation(
                **normalize_google_place(
                    raw.payload,
                    data_source=raw.data_source,
                    data_source_id=raw.data_source_id,
                    item_category=ItemCategory.SHOES,
                    activity=Activity.REPAIR_PAID,
                )
            )
            for raw in raw_locations
        ]


class GooglePlacesDonationNormalizer(BaseNormalizer):
    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Normalizes a list of raw donation center locations into normalized locations.

        Maps each raw Google Place payload to a NormalizedLocation with the
        item category set to CLOTHING and the activity set to DONATION_DROP.

        Args:
            raw_locations: A list of RawLocation objects to be normalized.

        Returns:
            A list of NormalizedLocation objects.

        Examples:
            >>> normalizer = GooglePlacesDonationNormalizer()
            >>> locations = normalizer.normalize([])
            >>> len(locations)
            0
        """
        return [
            NormalizedLocation(
                **normalize_google_place(
                    raw.payload,
                    data_source=raw.data_source,
                    data_source_id=raw.data_source_id,
                    item_category=ItemCategory.CLOTHING,
                    activity=Activity.DONATION_DROP,
                )
            )
            for raw in raw_locations
        ]
