from etl.base.querier import BaseQuerier
from etl.dtos import RawLocation


class GooglePlacesQuerier(BaseQuerier):

    def fetch(self) -> list[RawLocation]:
        """Fetches raw location data from the Google Places API.

        Args:
            None.

        Returns:
            A list of raw locations from Google Places.

        Examples:
            >>> querier = GooglePlacesQuerier()
            >>> # querier.fetch()
        """
        pass
