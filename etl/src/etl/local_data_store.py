from etl.base.data_store import BaseDataStore
from etl.dtos import NormalizedLocation


# Reads and writes normalized locations to a local file.
class LocalDataStore(BaseDataStore):

    def write_source_snapshot(
        self,
        source: str,
        normalized_locations: list[NormalizedLocation],
    ) -> None:
        """Writes a snapshot of normalized locations to the local store.

        Args:
            source: The name of the data source.
            normalized_locations: A list of normalized locations to write.
            
        Returns:
            None.
            
        Examples:
            >>> store = LocalDataStore()
            >>> store.write_source_snapshot("test", [])
        """
        pass

    def read_source_snapshot(
        self,
        source: str,
    ) -> list[NormalizedLocation]:
        """Reads a snapshot of normalized locations from the local store.

        Args:
            source: The name of the data source to read from.

        Returns:
            A list of normalized locations read from the store.

        Examples:
            >>> store = LocalDataStore()
            >>> locations = store.read_source_snapshot("test")
        """
        pass

    def write_output_locations(
        self,
        output_locations: list[NormalizedLocation],
    ) -> None:
        """Writes the final output locations to the local store.

        Args:
            output_locations: A list of merged and normalized locations.

        Returns:
            None.

        Examples:
            >>> store = LocalDataStore()
            >>> store.write_output_locations([])
        """
        pass
