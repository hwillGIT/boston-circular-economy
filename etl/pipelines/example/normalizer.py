from base.normalizer import BaseNormalizer
from dtos import (
    Activity,
    Address,
    Availability,
    Contact,
    ItemCategory,
    NormalizedLocation,
    RawLocation,
    Service,
)


class ExampleNormalizer(BaseNormalizer):
    """
    Convert example RawLocation payloads into the shared NormalizedLocation schema.

    Each real data source can use different field names and nesting.
    A normalizer is the place where that source-specific shape becomes predictable.
    """

    def normalize(self, raw_locations: list[RawLocation]) -> list[NormalizedLocation]:
        """Map every raw example record into the DTO shape used by ingesters."""
        normalized_locations = []
        for raw in raw_locations:
            payload = raw.payload
            services = []
            for raw_service in payload["services"]:
                # Convert source strings into enums so invalid activities or categories fail early.
                services.append(
                    Service(
                        activity=Activity(raw_service["activity"]),
                        item_category=ItemCategory(raw_service["item_category"]),
                    )
                )
            normalized_locations.append(
                NormalizedLocation(
                    data_source_id=raw.data_source_id,
                    data_source="example",
                    name=payload["name"],
                    lat=payload["lat"],
                    lon=payload["lon"],
                    # Address, Contact, Service, and Availability keep related fields grouped.
                    address=Address(
                        street=payload["address"]["street"],
                        city=payload["address"]["city"],
                        state=payload["address"]["state"],
                        postcode=payload["address"]["postcode"],
                    ),
                    contact=Contact(
                        phone=payload.get("phone"),
                        website=payload.get("website"),
                    ),
                    services=services,
                    availability=Availability(
                        opening_hours=payload.get("opening_hours"),
                    ),
                )
            )
        return normalized_locations
