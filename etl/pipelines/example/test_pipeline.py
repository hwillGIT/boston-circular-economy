from pipelines.example.querier import ExampleQuerier
from pipelines.example.normalizer import ExampleNormalizer
from dtos import Activity, ItemCategory


def test_example_querier_wraps_mock_data_as_raw_locations():
    """The querier should keep source data raw and add pipeline metadata."""
    querier = ExampleQuerier()

    raw_locations = querier.fetch()

    # The querier owns fetching.
    # It should not reshape the source payload into our final schema yet.
    first_location = raw_locations[0]
    assert first_location.data_source == "example"
    assert first_location.data_source_id == "example-001"
    assert first_location.payload["name"] == "Beacon Hill Repair Cafe"
    assert first_location.payload["services"][0]["activity"] == "repair_free"


def test_example_normalizer_maps_core_location_fields():
    """The normalizer should map identity, coordinates, and address fields."""
    querier = ExampleQuerier()
    normalizer = ExampleNormalizer()

    # This mirrors the production flow:
    # fetch source-shaped records, then normalize them into the shared schema.
    raw_locations = querier.fetch()
    normalized_locations = normalizer.normalize(raw_locations)

    assert len(normalized_locations) == len(raw_locations)

    # These assertions document the most important field mapping.
    # If a future pipeline copies this example, these are the fields to preserve.
    first_location = normalized_locations[0]
    assert first_location.data_source == "example"
    assert first_location.data_source_id == "example-001"
    assert first_location.name == "Beacon Hill Repair Cafe"
    assert first_location.lat == 42.3588
    assert first_location.lon == -71.0707
    assert first_location.address.street == "74 Joy St"
    assert first_location.address.city == "Boston"
    assert first_location.address.state == "MA"
    assert first_location.address.postcode == "02114"


def test_example_normalizer_maps_contact_services_and_availability():
    """The normalizer should map nested details into their DTO objects."""
    querier = ExampleQuerier()
    normalizer = ExampleNormalizer()

    raw_locations = querier.fetch()
    normalized_locations = normalizer.normalize(raw_locations)

    first_location = normalized_locations[0]

    # Contact and availability fields are optional in many real data sources.
    # The example shows using payload.get(...) so missing optional fields can stay None.
    assert first_location.contact.phone == "617-555-0101"
    assert first_location.contact.website == "https://example.com/beacon-hill-repair"
    assert first_location.availability.opening_hours == "Sa 10:00-14:00"

    # Services use enums instead of plain strings.
    # That helps catch unsupported activities or item categories during normalization.
    assert len(first_location.services) == 2
    assert first_location.services[0].activity == Activity.REPAIR_FREE
    assert first_location.services[0].item_category == ItemCategory.ELECTRONICS
    assert first_location.services[1].activity == Activity.REPAIR_FREE
    assert first_location.services[1].item_category == ItemCategory.CLOTHING
