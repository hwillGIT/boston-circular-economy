"""Tests for the merge package."""
from __future__ import annotations

from etl.dtos import (
    Address,
    Availability,
    Contact,
    MatchGroup,
    NormalizedLocation,
    Activity,
    ItemCategory,
    Service,
)
from etl.merge.config import MergeConfig
from etl.merge.geo import haversine_m
from etl.merge.similarity import normalize_name, name_similarity, is_name_match
from etl.merge.matcher import GeoNameMatcher
from etl.merge.merger import PriorityFillMerger


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _loc(
    name: str = "Test Place",
    lat: float = 42.3601,
    lon: float = -71.0589,
    source: str = "openstreetmap",
    phone: str | None = None,
    website: str | None = None,
    hours: str | None = None,
    rating: float | None = None,
    review_count: int | None = None,
) -> NormalizedLocation:
    return NormalizedLocation(
        data_source_id=f"{source}_{name.lower().replace(' ', '_')}",
        data_source=source,
        name=name,
        lat=lat,
        lon=lon,
        address=Address(street="123 Main St", city="Boston", state="MA"),
        contact=Contact(phone=phone, website=website),
        services=[Service(activity=Activity.REPAIR_FREE, item_category=ItemCategory.SHOES)],
        availability=Availability(opening_hours=hours),
        rating=rating,
        review_count=review_count,
    )


# ---------------------------------------------------------------------------
# Geo tests
# ---------------------------------------------------------------------------

def test_haversine_known_distance():
    """Verify haversine distance between two known coordinates.

    Calculates distance between Boston Common and Boston Public Library
    and asserts it is between 500 and 1200 meters.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If distance is outside bounds.

    Example:
        >>> test_haversine_known_distance()
    """
    # Boston Common to Boston Public Library is ~600m
    d = haversine_m(42.3551, -71.0656, 42.3496, -71.0779)
    assert 500 < d < 1200


def test_haversine_same_point():
    """Verify haversine distance between the same point is zero.

    Calls haversine_m with identical start and end coordinates.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If distance is not zero.

    Example:
        >>> test_haversine_same_point()
    """
    assert haversine_m(42.36, -71.06, 42.36, -71.06) == 0.0


# ---------------------------------------------------------------------------
# Similarity tests
# ---------------------------------------------------------------------------

def test_normalize_strips_suffix():
    """Verify that normalize_name strips common suffixes.

    Asserts that suffixes like 'Store' and 'Center' are removed.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the suffix is not stripped correctly.

    Example:
        >>> test_normalize_strips_suffix()
    """
    assert normalize_name("Goodwill Store") == "goodwill"
    assert normalize_name("Repair Center") == "repair"


def test_normalize_strips_punctuation():
    """Verify that normalize_name strips all punctuation.

    Asserts that apostrophes and hyphens are removed from the name.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If punctuation is not stripped.

    Example:
        >>> test_normalize_strips_punctuation()
    """
    # normalize_name strips ALL punctuation (apostrophes, hyphens)
    assert normalize_name("Mike's Fix-It Shop") == "mikes fixit"


def test_similarity_exact():
    """Verify that name_similarity returns 1.0 for exact matches.

    Calculates similarity between two identical strings.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If similarity is not 1.0.

    Example:
        >>> test_similarity_exact()
    """
    assert name_similarity("goodwill", "goodwill") == 1.0


def test_similarity_partial():
    """Verify that name_similarity returns a partial match score.

    Calculates similarity between a base name and a longer variation.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If similarity score is not > 0.5.

    Example:
        >>> test_similarity_partial()
    """
    # After normalization: "goodwill" vs "goodwill industries"
    sim = name_similarity(normalize_name("Goodwill"), normalize_name("Goodwill Industries"))
    assert sim > 0.5


def test_similarity_no_match():
    """Verify that name_similarity returns a low score for dissimilar names.

    Calculates similarity between completely different strings.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If similarity score is not < 0.4.

    Example:
        >>> test_similarity_no_match()
    """
    sim = name_similarity("goodwill", "starbucks")
    assert sim < 0.4


def test_is_name_match_true():
    """Verify that is_name_match returns True for similar names above threshold.

    Evaluates match between two related names with a threshold of 0.6.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the names do not match.

    Example:
        >>> test_is_name_match_true()
    """
    assert is_name_match("Goodwill Store", "Goodwill Industries", 0.6)


def test_is_name_match_false():
    """Verify that is_name_match returns False for dissimilar names.

    Evaluates match between two unrelated names with a threshold of 0.6.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the names match incorrectly.

    Example:
        >>> test_is_name_match_false()
    """
    assert not is_name_match("Goodwill", "Starbucks", 0.6)


# ---------------------------------------------------------------------------
# Matcher tests
# ---------------------------------------------------------------------------

def test_match_same_location_different_sources():
    """Verify that GeoNameMatcher groups identical locations from different sources.

    Provides locations from Google Places and OpenStreetMap that represent the same entity.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If they are not grouped together correctly.

    Example:
        >>> test_match_same_location_different_sources()
    """
    cfg = MergeConfig()
    matcher = GeoNameMatcher(cfg)
    locs = {
        "google_places": [_loc("Goodwill Store", 42.3601, -71.0589, "google_places")],
        "openstreetmap": [_loc("Goodwill Industries", 42.3601, -71.0590, "openstreetmap")],
    }
    groups = matcher.match(locs)
    assert len(groups) == 1
    assert len(groups[0]) == 2


def test_match_different_locations_not_grouped():
    """Verify that GeoNameMatcher does not group distant, dissimilar locations.

    Provides unrelated locations from different sources with distinct coordinates.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If they are incorrectly grouped together.

    Example:
        >>> test_match_different_locations_not_grouped()
    """
    cfg = MergeConfig()
    matcher = GeoNameMatcher(cfg)
    locs = {
        "google_places": [_loc("Goodwill", 42.3601, -71.0589, "google_places")],
        "openstreetmap": [_loc("Starbucks", 42.37, -71.07, "openstreetmap")],
    }
    groups = matcher.match(locs)
    assert len(groups) == 2


def test_match_nearby_but_different_name():
    """Verify that GeoNameMatcher distinguishes locations with same coordinates but different names.

    Provides different business names at identical coordinates to ensure they remain distinct groups.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the different businesses are grouped together.

    Example:
        >>> test_match_nearby_but_different_name()
    """
    cfg = MergeConfig()
    matcher = GeoNameMatcher(cfg)
    locs = {
        "google_places": [_loc("Goodwill", 42.3601, -71.0589, "google_places")],
        "openstreetmap": [_loc("Starbucks", 42.3601, -71.0589, "openstreetmap")],
    }
    groups = matcher.match(locs)
    assert len(groups) == 2  # Same spot, different business


# ---------------------------------------------------------------------------
# Merger tests
# ---------------------------------------------------------------------------

def test_merge_fills_missing_phone():
    """Verify that PriorityFillMerger fills missing phone fields from other sources.

    Uses a match group where one source lacks a phone number and another has one.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the phone field is not filled or fields dictionary is incorrect.

    Example:
        >>> test_merge_fills_missing_phone()
    """
    cfg = MergeConfig()
    merger = PriorityFillMerger(cfg)
    group: MatchGroup = {
        "google_places": _loc("Goodwill", source="google_places", phone=None),
        "openstreetmap": _loc("Goodwill", source="openstreetmap", phone="617-555-1234"),
    }
    fields: dict[str, int] = {}
    result = merger.merge([group], fields)
    assert len(result) == 1
    assert result[0].contact.phone == "617-555-1234"
    assert fields.get("contact.phone", 0) == 1


def test_merge_fills_missing_hours():
    """Verify that PriorityFillMerger fills missing opening hours.

    Uses a match group where one source provides hours and another lacks them.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the opening hours are not correctly populated.

    Example:
        >>> test_merge_fills_missing_hours()
    """
    cfg = MergeConfig()
    merger = PriorityFillMerger(cfg)
    group: MatchGroup = {
        "google_places": _loc("Repair Shop", source="google_places", hours="Mon-Fri 9-5"),
        "openstreetmap": _loc("Repair Shop", source="openstreetmap", hours=None),
    }
    fields: dict[str, int] = {}
    result = merger.merge([group], fields)
    assert result[0].availability.opening_hours == "Mon-Fri 9-5"


def test_merge_unions_services():
    """Verify that PriorityFillMerger combines services from multiple sources.

    Uses a match group with distinct services in different sources to ensure union behavior.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the services list doesn't contain all unique services.

    Example:
        >>> test_merge_unions_services()
    """
    cfg = MergeConfig()
    merger = PriorityFillMerger(cfg)
    loc_gp = _loc("Fix It", source="google_places")
    loc_gp.services = [Service(activity=Activity.REPAIR_PAID, item_category=ItemCategory.SHOES)]
    loc_osm = _loc("Fix It", source="openstreetmap")
    loc_osm.services = [Service(activity=Activity.REPAIR_FREE, item_category=ItemCategory.ELECTRONICS)]
    group: MatchGroup = {"google_places": loc_gp, "openstreetmap": loc_osm}
    fields: dict[str, int] = {}
    result = merger.merge([group], fields)
    assert len(result[0].services) == 2


def test_merge_prefers_higher_rated():
    """Verify that PriorityFillMerger prefers ratings from sources with more reviews.

    Provides a match group with differing ratings and review counts to test conflict resolution.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the preferred rating is not selected.

    Example:
        >>> test_merge_prefers_higher_rated()
    """
    cfg = MergeConfig()
    merger = PriorityFillMerger(cfg)
    group: MatchGroup = {
        "google_places": _loc("Shop", source="google_places", rating=4.2, review_count=50),
        "openstreetmap": _loc("Shop", source="openstreetmap", rating=4.8, review_count=200),
    }
    fields: dict[str, int] = {}
    result = merger.merge([group], fields)
    assert result[0].rating == 4.8  # OSM has more reviews
    assert result[0].review_count == 200


def test_merge_single_source_passthrough():
    """Verify that PriorityFillMerger handles groups with only a single source.

    Passes a single location to ensure fields are populated properly without merge conflicts.

    Args:
        None

    Returns:
        None

    Raises:
        AssertionError: If the resulting entity does not match the single source.

    Example:
        >>> test_merge_single_source_passthrough()
    """
    cfg = MergeConfig()
    merger = PriorityFillMerger(cfg)
    group: MatchGroup = {
        "google_places": _loc("Solo Shop", source="google_places", phone="617-000-0000"),
    }
    fields: dict[str, int] = {}
    result = merger.merge([group], fields)
    assert len(result) == 1
    assert result[0].name == "Solo Shop"
    assert result[0].contact.phone == "617-000-0000"
