import json
from datetime import UTC, datetime
from pathlib import Path

from dtos import Activity, ItemCategory, RawLocation
from pipelines.google_places.normalizer import (
    GooglePlacesDonationNormalizer,
    GooglePlacesRepairNormalizer,
)

SAMPLES = Path(__file__).resolve().parents[3] / "data-explorations" / "google-places" / "samples"


def _load_places(name: str):
    return json.loads((SAMPLES / name).read_text())["places"]


def _raw_locations(data_source: str, prefix: str, filename: str):
    fetched_at = datetime.now(UTC)
    return [
        RawLocation(
            data_source=data_source,
            data_source_id=f"{prefix}-{index}",
            fetched_at=fetched_at,
            payload=place,
        )
        for index, place in enumerate(_load_places(filename))
    ]


def test_repair_normalizer_maps_google_places_sample():
    """Tests the normalization of a sample shoe repair Google Places payload.

    Loads a JSON sample of shoe repair locations from the filesystem and asserts
    that the GooglePlacesRepairNormalizer correctly maps the data source, activity,
    item category, name, and address.

    Raises:
        AssertionError: If any of the assertions fail.

    Examples:
        >>> test_repair_normalizer_maps_google_places_sample()  # Tests pass if no exception
    """
    normalized = GooglePlacesRepairNormalizer().normalize(
        _raw_locations("google_places_repair", "repair", "shoe-repair-00.json")
    )

    assert normalized
    assert normalized[0].data_source == "google_places_repair"
    assert normalized[0].services[0].activity == Activity.REPAIR_PAID
    assert normalized[0].services[0].item_category == ItemCategory.SHOES
    assert normalized[0].name == "David's Instant Shoe Repair"
    assert normalized[0].address.street == "281 Franklin St, Boston, MA 02110, USA"


def test_donation_normalizer_maps_google_places_sample():
    """Tests the normalization of a sample donation center Google Places payload.

    Loads a JSON sample of donation center locations from the filesystem and
    asserts that the GooglePlacesDonationNormalizer correctly maps the data
    source, activity, item category, and name.

    Raises:
        AssertionError: If any of the assertions fail.

    Examples:
        >>> test_donation_normalizer_maps_google_places_sample()  # Tests pass if no exception
    """
    normalized = GooglePlacesDonationNormalizer().normalize(
        _raw_locations("google_places_donations", "donation", "donations-00.json")
    )

    assert normalized
    assert normalized[0].data_source == "google_places_donations"
    assert normalized[0].services[0].activity == Activity.DONATION_DROP
    assert normalized[0].services[0].item_category == ItemCategory.CLOTHING
    assert normalized[0].name == "Morgan Memorial Goodwill Industries"
