from abc import ABC, abstractmethod

from etl.dtos import RawLocation, NormalizedLocation


class BaseNormalizer(ABC):
    """
    Subclass this to implement a normalizer for a data source.

    normalize() should transform a list of RawLocations into
    NormalizedLocations, mapping source-specific fields to the
    shared schema.
    """

    @abstractmethod
    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Normalizes a list of raw locations into the common schema.

        Args:
            raw_locations: A list of raw location data objects.

        Returns:
            A list of locations normalized to the standard format.

        Raises:
            NotImplementedError: If not implemented by subclass.

        Examples:
            >>> class MyNormalizer(BaseNormalizer):
            ...     def normalize(self, locs): return []
            >>> norm = MyNormalizer()
            >>> norm.normalize([])
            []
        """
        pass
