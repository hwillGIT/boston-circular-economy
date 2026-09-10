from etl.base.normalizer import BaseNormalizer
from etl.dtos import NormalizedLocation, RawLocation


class OpenStreetMapNormalizer(BaseNormalizer):
    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Normalizes raw OpenStreetMap locations to the shared schema.

        Args:
            raw_locations: A list of raw locations fetched from OpenStreetMap.

        Returns:
            A list of normalized locations ready for merging.

        Examples:
            >>> normalizer = OpenStreetMapNormalizer()
            >>> normalizer.normalize([])
            []
        """
        pass
