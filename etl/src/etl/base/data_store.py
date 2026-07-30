from abc import ABC, abstractmethod

from etl.dtos import NormalizedLocation


class BaseDataStore(ABC):
    """
    Subclass this to implement a new storage backend.
    """

    @abstractmethod
    def write_source_snapshot(
        self,
        source: str,
        normalized_locations: list[NormalizedLocation],
    ) -> None:
        """Writes a snapshot of normalized locations from a source to storage.

        Args:
            source: The name of the data source.
            normalized_locations: A list of normalized locations to persist.

        Returns:
            None.

        Raises:
            NotImplementedError: If not implemented by subclass.

        Examples:
            >>> class MyStore(BaseDataStore):
            ...     def write_source_snapshot(self, src, locs): pass
            ...     def read_source_snapshot(self, src): return []
            ...     def write_output_locations(self, locs): pass
            >>> store = MyStore()
            >>> store.write_source_snapshot("test", [])
        """
        pass

    @abstractmethod
    def read_source_snapshot(
        self,
        source: str,
    ) -> list[NormalizedLocation]:
        """Reads a snapshot of normalized locations for a given source.

        Args:
            source: The name of the data source.

        Returns:
            A list of normalized locations retrieved from storage.

        Raises:
            NotImplementedError: If not implemented by subclass.

        Examples:
            >>> class MyStore(BaseDataStore):
            ...     def write_source_snapshot(self, src, locs): pass
            ...     def read_source_snapshot(self, src): return []
            ...     def write_output_locations(self, locs): pass
            >>> store = MyStore()
            >>> locations = store.read_source_snapshot("test")
        """
        pass

    @abstractmethod
    def write_output_locations(
        self,
        output_locations: list[NormalizedLocation],
    ) -> None:
        """Writes the finalized locations to the output storage.

        Args:
            output_locations: A list of normalized locations to output.

        Returns:
            None.

        Raises:
            NotImplementedError: If not implemented by subclass.

        Examples:
            >>> class MyStore(BaseDataStore):
            ...     def write_source_snapshot(self, src, locs): pass
            ...     def read_source_snapshot(self, src): return []
            ...     def write_output_locations(self, locs): pass
            >>> store = MyStore()
            >>> store.write_output_locations([])
        """
        pass
