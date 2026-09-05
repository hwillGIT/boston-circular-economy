from __future__ import annotations

import math
from typing import Protocol


class HasCoordinates(Protocol):
    @property
    def lat(self) -> float:
        """Returns the latitude of the location.

        Returns:
            The latitude as a float.

        Examples:
            >>> class Loc:
            ...     @property
            ...     def lat(self): return 42.3601
            ...     @property
            ...     def lon(self): return -71.0589
            >>> Loc().lat
            42.3601
        """
        ...

    @property
    def lon(self) -> float:
        """Returns the longitude of the location.

        Returns:
            The longitude as a float.

        Examples:
            >>> class Loc:
            ...     @property
            ...     def lat(self): return 42.3601
            ...     @property
            ...     def lon(self): return -71.0589
            >>> Loc().lon
            -71.0589
        """
        ...


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance in meters between two lat/lon points."""
    earth_radius_m = 6_371_000
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * earth_radius_m * math.asin(math.sqrt(a))


def is_within_radius(loc_a: HasCoordinates, loc_b: HasCoordinates, radius_m: float) -> bool:
    """Check if two locations are within radius_m meters of each other."""
    dist = haversine_m(loc_a.lat, loc_a.lon, loc_b.lat, loc_b.lon)
    return dist <= radius_m
