"""
Geocodes the Google Places sample data using the US Census Bureau's free
batch geocoding API, with Nominatim (OpenStreetMap) as a fallback.

No API key required for either service.

Run:
    python3 etl/geocode_google_places.py
"""

import csv
import io
import json
import re
import sqlite3
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = str(ROOT / "dev.db")

CENSUS_BATCH_URL = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

# ── Google Places type → (activity, item_category) ───────────────────────────

TYPE_ACTIVITY_MAP: dict[str, tuple[str, str]] = {
    "appliance_repair_service":     ("repair_paid", "tools"),
    "electronics_store":            ("repair_paid", "electronics"),
    "computer_repair_service":      ("repair_paid", "electronics"),
    "shoe_repair_shop":             ("repair_paid", "shoes"),
    "clothing_alteration_service":  ("repair_paid", "clothing"),
    "tailor":                       ("repair_paid", "clothing"),
    "second_hand_store":            ("resale_buy",  "clothing"),
    "thrift_store":                 ("resale_buy",  "clothing"),
    "charity":                      ("donation_drop", "clothing"),
    "donation_center":              ("donation_drop", "clothing"),
    "furniture_store":              ("resale_buy",  "furniture"),
    "book_store":                   ("resale_buy",  "books"),
    "association_or_organization":  ("donation_drop", "clothing"),
}

SOURCE_ACTIVITY_MAP: dict[str, tuple[str, str]] = {
    "appliance-repair":   ("repair_paid", "tools"),
    "electronics-repair": ("repair_paid", "electronics"),
    "shoe-repair":        ("repair_paid", "shoes"),
    "donations":          ("donation_drop", "clothing"),
    "repair-shops":       ("repair_paid", "tools"),
}


def infer_services(types: list[str], source: str) -> list[tuple[str, str]]:
    for t in types:
        if t in TYPE_ACTIVITY_MAP:
            return [TYPE_ACTIVITY_MAP[t]]
    for prefix, svc in SOURCE_ACTIVITY_MAP.items():
        if source.startswith(prefix):
            return [svc]
    return [("repair_paid", "tools")]


# ── address parsing ───────────────────────────────────────────────────────────

def parse_address(formatted: str) -> tuple[str, str, str, str]:
    """Split 'Street, City, ST ZIP, USA' into (street, city, state, zip)."""
    parts = [p.strip() for p in formatted.split(",")]
    # drop trailing 'USA'
    if parts and parts[-1].upper() in ("USA", "US"):
        parts = parts[:-1]

    if len(parts) < 3:
        return formatted, "", "", ""

    street = parts[0]
    city   = parts[-2]

    state_zip = parts[-1].strip()
    m = re.match(r"([A-Z]{2})\s+(\d{5}(?:-\d{4})?)", state_zip)
    if m:
        state, zipcode = m.group(1), m.group(2)
    else:
        state, zipcode = state_zip, ""

    return street, city, state, zipcode


# ── Census batch geocoder ─────────────────────────────────────────────────────

def census_batch(records: list[dict]) -> dict[str, tuple[float, float]]:
    """Submit up to 10 000 records; return {id: (lat, lon)} for matches."""
    rows = []
    for r in records:
        street, city, state, zipcode = parse_address(r["address"])
        rows.append(f'{r["id"]},"{street}","{city}","{state}","{zipcode}"')

    csv_payload = "\n".join(rows).encode()

    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="benchmark"\r\n\r\n'
        f"Public_AR_Current\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="addressFile"; filename="addresses.csv"\r\n'
        f"Content-Type: text/csv\r\n\r\n"
    ).encode() + csv_payload + f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        CENSUS_BATCH_URL,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent":   "boston-circular-economy/1.0 (education)",
        },
        method="POST",
    )

    results: dict[str, tuple[float, float]] = {}
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            text = resp.read().decode("utf-8")
        reader = csv.reader(io.StringIO(text))
        for row in reader:
            # Census output: ID, input_address, match, exact, matched_address, coords, ...
            if len(row) < 6:
                continue
            rec_id, _, match, _, _, coords = row[:6]
            if match.strip().lower() == "match" and coords.strip():
                lon_str, lat_str = coords.strip().split(",")
                results[rec_id.strip()] = (float(lat_str), float(lon_str))
    except Exception as exc:
        print(f"  Census batch error: {exc}")

    return results


# ── Nominatim single geocoder ─────────────────────────────────────────────────

def nominatim_one(address: str) -> tuple[float, float] | None:
    query = urllib.parse.urlencode({"q": address, "format": "json", "limit": "1"})
    req = urllib.request.Request(
        f"{NOMINATIM_URL}?{query}",
        headers={"User-Agent": "boston-circular-economy/1.0 (education)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception:
        pass
    return None


# ── database helpers ──────────────────────────────────────────────────────────

def upsert_location(cur: sqlite3.Cursor, row: dict) -> int | None:
    cur.execute(
        """
        INSERT INTO locations
          (data_source, data_source_id, name, lat, lon,
           street, city, state, postcode,
           opening_hours, is_persistent)
        VALUES
          (:data_source, :data_source_id, :name, :lat, :lon,
           :street, :city, :state, :postcode,
           NULL, 1)
        ON CONFLICT(data_source, data_source_id) DO UPDATE SET
          name=excluded.name, lat=excluded.lat, lon=excluded.lon,
          street=excluded.street, city=excluded.city,
          state=excluded.state, postcode=excluded.postcode,
          updated_at=datetime('now')
        RETURNING id
        """,
        row,
    )
    r = cur.fetchone()
    return r[0] if r else None


def insert_services(cur: sqlite3.Cursor, loc_id: int, services: list[tuple[str, str]]) -> None:
    cur.execute("DELETE FROM services WHERE location_id = ?", (loc_id,))
    for activity, category in services:
        cur.execute(
            "INSERT INTO services (location_id, activity, item_category) VALUES (?, ?, ?)",
            (loc_id, activity, category),
        )


# ── main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    samples = ROOT / "data-explorations" / "google-places" / "samples"

    # collect all places with a unique ID
    places: list[dict] = []
    for path in sorted(samples.glob("*.json")):
        source = path.stem
        data = json.loads(path.read_text())
        for i, p in enumerate(data.get("places", [])):
            places.append({
                "id":       f"gp-{source}-{i}",
                "source":   source,
                "name":     p["displayName"]["text"],
                "address":  p["formattedAddress"],
                "types":    p.get("types", []),
            })

    print(f"Loaded {len(places)} Google Places records")

    # ── batch geocode with Census ──────────────────────────────────────────
    print("Geocoding via US Census Bureau batch API…")
    coords_map = census_batch(places)
    print(f"  Census matched: {len(coords_map)}/{len(places)}")

    # ── fallback unmatched to Nominatim ────────────────────────────────────
    unmatched = [p for p in places if p["id"] not in coords_map]
    if unmatched:
        print(f"Falling back to Nominatim for {len(unmatched)} records…")
        for p in unmatched:
            coords = nominatim_one(p["address"])
            if coords:
                coords_map[p["id"]] = coords
                print(f"  ✓  {p['name']}")
            else:
                print(f"  ✗  {p['name']} — no match")
            time.sleep(1.1)   # Nominatim ToS: max 1 req/sec

    total_geocoded = len(coords_map)
    print(f"Geocoded {total_geocoded}/{len(places)} records")

    # ── write to database ──────────────────────────────────────────────────
    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA journal_mode=WAL")
    cur = con.cursor()

    inserted = 0
    for p in places:
        if p["id"] not in coords_map:
            continue
        lat, lon = coords_map[p["id"]]
        street, city, state, zipcode = parse_address(p["address"])
        services = infer_services(p["types"], p["source"])

        loc_id = upsert_location(cur, {
            "data_source":    "google_places",
            "data_source_id": p["id"],
            "name":           p["name"],
            "lat":            lat,
            "lon":            lon,
            "street":         street,
            "city":           city,
            "state":          state,
            "postcode":       zipcode,
        })
        if loc_id:
            insert_services(cur, loc_id, services)
            inserted += 1

    con.commit()
    con.close()
    print(f"Inserted {inserted} geocoded locations into {DB_PATH}")


if __name__ == "__main__":
    main()
