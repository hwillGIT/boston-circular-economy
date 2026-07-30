from abc import ABC, abstractmethod

from etl.dtos import RawLocation


class BaseQuerier(ABC):
    """
    Subclass this to implement a new data source.

    fetch() should return all locations for the source,
    handling pagination internally if the API requires it.
    """

    @abstractmethod
    def fetch(self) -> list[RawLocation]:
        """Fetches all locations from the data source.

        Args:
            None.

        Returns:
            A list of raw locations retrieved from the source.

        Raises:
            NotImplementedError: If not implemented by subclass.

        Examples:
            >>> class MyQuerier(BaseQuerier):
            ...     def fetch(self): return []
            >>> querier = MyQuerier()
            >>> querier.fetch()
            []
        """
        pass
