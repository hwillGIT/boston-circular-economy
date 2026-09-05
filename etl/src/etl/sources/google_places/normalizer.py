from etl.base.normalizer import BaseNormalizer
from etl.dtos import NormalizedLocation, RawLocation


class GooglePlacesNormalizer(BaseNormalizer):
    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Normalizes raw Google Places locations to the shared schema.

        Args:
            raw_locations: A list of raw locations fetched from Google Places.

        Returns:
            A list of normalized locations ready for merging.

        Examples:
            >>> normalizer = GooglePlacesNormalizer()
            >>> normalizer.normalize([])
            []
        """
        pass
