from etl.base.querier import BaseQuerier
from etl.dtos import RawLocation


class OpenStreetMapQuerier(BaseQuerier):

    def fetch(self) -> list[RawLocation]:
        """Fetches raw location data from the OpenStreetMap API.

        Args:
            None.

        Returns:
            A list of raw locations from OpenStreetMap.

        Examples:
            >>> querier = OpenStreetMapQuerier()
            >>> # querier.fetch()
        """
        pass
