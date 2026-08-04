from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from dtos import Activity, Address, Availability, Contact, ItemCategory, Service


@dataclass(frozen=True)
class GooglePlacesQuery:
    text_query: str
    data_source: str
    item_category: ItemCategory
    activity: Activity


def extract_postcode(formatted_address: str | None) -> str | None:
    """Extracts a 5-digit US postcode from a formatted address string.
    
    Splits the address string into parts and returns the first 5-digit numeric
    string found. Returns None if no such string is found or if the input is None.
    
    Args:
        formatted_address: A string representing a formatted address, or None.
        
    Returns:
        The extracted 5-digit postcode as a string, or None if not found.
        
    Examples:
        >>> extract_postcode("281 Franklin St, Boston, MA 02110, USA")
        '02110'
        >>> extract_postcode(None)
        None
    """
    if not formatted_address:
        return None
    parts = formatted_address.split()
    for part in parts:
        if len(part) == 5 and part.isdigit():
            return part
    return None


def normalize_google_place(
    raw: dict[str, Any],
    *,
    data_source: str,
    data_source_id: str,
    item_category: ItemCategory,
    activity: Activity,
) -> dict[str, Any]:
    """Normalizes a raw Google Place JSON payload into a standard dictionary.
    
    Extracts relevant fields such as name, location, address, contact info,
    services, and availability from the raw Google Place data and maps them
    to a standard dictionary structure.
    
    Args:
        raw: The raw Google Place data dictionary.
        data_source: The string identifying the source of the data.
        data_source_id: The string identifying the data source ID.
        item_category: The item category to assign to the service.
        activity: The activity type to assign to the service.
        
    Returns:
        A dictionary containing the normalized location data.
        
    Examples:
        >>> raw_data = {"displayName": {"text": "Store"}, "location": {"latitude": 42.0, "longitude": -71.0}}
        >>> result = normalize_google_place(raw_data, data_source="google", data_source_id="123", item_category=ItemCategory.SHOES, activity=Activity.REPAIR_PAID)
        >>> result["name"]
        'Store'
        >>> result["lat"]
        42.0
    """
    display_name = raw.get("displayName") or {}
    formatted_address = raw.get("formattedAddress")
    location = raw.get("location") or {}
    
    opening_hours_raw = raw.get("currentOpeningHours") or raw.get("regularOpeningHours") or {}
    weekday_descriptions = opening_hours_raw.get("weekdayDescriptions")
    opening_hours_str = None
    if weekday_descriptions:
        opening_hours_str = "; ".join(weekday_descriptions)

    return {
        "data_source_id": data_source_id,
        "data_source": data_source,
        "name": display_name.get("text") or data_source_id,
        "lat": location.get("latitude", 0.0),
        "lon": location.get("longitude", 0.0),
        "address": Address(
            street=formatted_address,
            postcode=extract_postcode(formatted_address),
        ),
        "contact": Contact(
            phone=raw.get("nationalPhoneNumber"),
            website=raw.get("websiteUri")
        ),
        "services": [Service(activity=activity, item_category=item_category)],
        "availability": Availability(opening_hours=opening_hours_str),
        "rating": raw.get("rating"),
        "review_count": raw.get("userRatingCount"),
    }
