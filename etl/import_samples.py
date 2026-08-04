"""
One-shot import script: loads the OSM sample data files into the SQLite database.

Sources used:
  - data-explorations/openstreetmap/samples/sources.json  (pre-normalised)
  - data-explorations/openstreetmap/samples/broad-search-00.json  (raw Overpass)
  - data-explorations/openstreetmap/samples/repair-00.json  (raw Overpass)

Google Places files are skipped — they contain no coordinates.
"""

import json
import os
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = os.environ.get("SQLITE_PATH") or str(ROOT / "dev.db")

# ── activity / category mappings ─────────────────────────────────────────────

ACTIVITY_MAP = {
    "donate":  "donation_drop",
    "resell":  "resale_buy",
    "repair":  "repair_paid",
    "reuse":   "donation_pick",
    "alter":   "repair_paid",
    "rent":    "renting",
}

CATEGORY_MAP = {
    "clothing":          "clothing",
    "electronics":       "electronics",
    "art_supplies":      "tools",        # closest match
    "musical_instruments": "tools",
    "tires":             "tools",
    "books":             "books",
    "furniture":         "furniture",
    "shoes":             "shoes",
    "tools":             "tools",
}

# OSM tag → (activity, category) heuristics
def infer_services_from_tags(tags: dict) -> list[tuple[str, str]]:
    services: list[tuple[str, str]] = []
    shop  = tags.get("shop", "")
    repair = tags.get("repair", "")
    rental = tags.get("rental", "") or tags.get("rent", "")

    if repair == "yes" or shop in ("electronics", "computer", "bicycle", "musical_instrument"):
        cat = {
            "electronics": "electronics",
            "computer": "electronics",
            "bicycle": "tools",
            "musical_instrument": "tools",
        }.get(shop, "electronics")
        services.append(("repair_paid", cat))

    if shop in ("charity", "second_hand", "thrift", "vintage"):
        services.append(("donation_drop", "clothing"))
        services.append(("resale_buy", "clothing"))

    if shop == "charity":
        services.append(("donation_pick", "clothing"))

    if rental == "yes":
        services.append(("renting", "tools"))

    if not services:
        services.append(("repair_paid", "tools"))

    # deduplicate
    seen: set[tuple[str, str]] = set()
    out = []
    for s in services:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out


# ── database helpers ──────────────────────────────────────────────────────────

def upsert_location(cur: sqlite3.Cursor, row: dict) -> int | None:
    if row.get("lat") is None or row.get("lon") is None:
        return None

    cur.execute(
        """
        INSERT INTO locations
          (data_source, data_source_id, name, lat, lon,
           street, city, state, postcode,
           phone, email, website, social,
           opening_hours, is_persistent, last_verified, rating, review_count)
        VALUES
          (:data_source, :data_source_id, :name, :lat, :lon,
           :street, :city, :state, :postcode,
           :phone, :email, :website, :social,
           :opening_hours, :is_persistent, :last_verified, :rating, :review_count)
        ON CONFLICT(data_source, data_source_id) DO UPDATE SET
          name=excluded.name, lat=excluded.lat, lon=excluded.lon,
          street=excluded.street, city=excluded.city, state=excluded.state, postcode=excluded.postcode,
          phone=excluded.phone, email=excluded.email, website=excluded.website, social=excluded.social,
          opening_hours=excluded.opening_hours, is_persistent=excluded.is_persistent,
          last_verified=excluded.last_verified, rating=excluded.rating, review_count=excluded.review_count,
          updated_at=datetime('now')
        RETURNING id
        """,
        {
            "data_source":    row["data_source"],
            "data_source_id": row["data_source_id"],
            "name":           row["name"],
            "lat":            row["lat"],
            "lon":            row["lon"],
            "street":         row.get("street"),
            "city":           row.get("city"),
            "state":          row.get("state"),
            "postcode":       row.get("postcode"),
            "phone":          row.get("phone"),
            "email":          row.get("email"),
            "website":        row.get("website"),
            "social":         row.get("social"),
            "opening_hours":  row.get("opening_hours"),
            "is_persistent":  1 if row.get("is_persistent", True) else 0,
            "last_verified":  row.get("last_verified"),
            "rating":         row.get("rating"),
            "review_count":   row.get("review_count"),
        },
    )
    result = cur.fetchone()
    return result[0] if result else None


def insert_services(cur: sqlite3.Cursor, location_id: int, services: list[tuple[str, str]]) -> None:
    cur.execute("DELETE FROM services WHERE location_id = ?", (location_id,))
    for activity, category in services:
        cur.execute(
            "INSERT INTO services (location_id, activity, item_category) VALUES (?, ?, ?)",
            (location_id, activity, category),
        )


# ── source parsers ────────────────────────────────────────────────────────────

def parse_sources_json(path: Path) -> list[dict]:
    records = json.loads(path.read_text())
    rows = []
    for r in records:
        addr = r.get("address") or {}
        contact = r.get("contact") or {}
        avail = r.get("availability") or {}
        services = []
        for act_raw in r.get("circular_activities", []):
            act = ACTIVITY_MAP.get(act_raw, "repair_paid")
            cats = r.get("material_categories", []) or ["tools"]
            for cat_raw in cats:
                cat = CATEGORY_MAP.get(cat_raw, "tools")
                services.append((act, cat))
            if not cats:
                services.append((act, "tools"))
        if not services:
            services = [("donation_drop", "tools")]
        social_raw = contact.get("social")
        if isinstance(social_raw, dict):
            social = next(iter(social_raw.values()), None)
        else:
            social = social_raw

        name = (r.get("name") or "").strip()
        if not name:
            continue

        rows.append({
            "data_source":    "openstreetmap",
            "data_source_id": r["source_id"],
            "name":           name,
            "lat":            r["lat"],
            "lon":            r["lon"],
            "street":         addr.get("street"),
            "city":           addr.get("city"),
            "state":          addr.get("state"),
            "postcode":       addr.get("postcode"),
            "phone":          contact.get("phone"),
            "email":          contact.get("email"),
            "website":        contact.get("website"),
            "social":         social,
            "opening_hours":  avail.get("opening_hours"),
            "is_persistent":  avail.get("is_persistent", True),
            "last_verified":  r.get("last_verified"),
            "rating":         None,
            "review_count":   None,
            "services":       services,
        })
    return rows


def parse_overpass_json(path: Path, source_prefix: str) -> list[dict]:
    data = json.loads(path.read_text())
    elements = data.get("elements", [])
    rows = []
    for el in elements:
        lat = el.get("lat")
        lon = el.get("lon")
        if lat is None or lon is None:
            continue
        tags = el.get("tags", {})
        name = (tags.get("name") or tags.get("alt_name") or "").strip()
        if not name:
            continue
        osm_id = f"{source_prefix}-{el['type']}-{el['id']}"
        street_parts = [tags.get("addr:housenumber", ""), tags.get("addr:street", "")]
        street = " ".join(p for p in street_parts if p).strip() or None

        phone = tags.get("phone") or tags.get("contact:phone")
        email = tags.get("email") or tags.get("contact:email")
        website = tags.get("website") or tags.get("contact:website")

        rows.append({
            "data_source":    "openstreetmap",
            "data_source_id": osm_id,
            "name":           name,
            "lat":            lat,
            "lon":            lon,
            "street":         street,
            "city":           tags.get("addr:city"),
            "state":          tags.get("addr:state"),
            "postcode":       tags.get("addr:postcode"),
            "phone":          phone,
            "email":          email,
            "website":        website,
            "social":         tags.get("contact:facebook"),
            "opening_hours":  tags.get("opening_hours"),
            "is_persistent":  True,
            "last_verified":  tags.get("check_date"),
            "rating":         None,
            "review_count":   None,
            "services":       infer_services_from_tags(tags),
        })
    return rows


# ── main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    samples = ROOT / "data-explorations" / "openstreetmap" / "samples"

    all_rows: list[dict] = []
    all_rows += parse_sources_json(samples / "sources.json")
    all_rows += parse_overpass_json(samples / "broad-search-00.json", "broad")
    all_rows += parse_overpass_json(samples / "repair-00.json", "repair")

    # Deduplicate by (data_source, data_source_id) — sources.json takes priority
    seen: set[tuple[str, str]] = set()
    deduped: list[dict] = []
    for row in all_rows:
        key = (row["data_source"], row["data_source_id"])
        if key not in seen:
            seen.add(key)
            deduped.append(row)

    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA journal_mode=WAL")
    cur = con.cursor()

    inserted = 0
    for row in deduped:
        services = row.pop("services")
        loc_id = upsert_location(cur, row)
        if loc_id is not None:
            insert_services(cur, loc_id, services)
            inserted += 1

    con.commit()
    con.close()
    print(f"Imported {inserted} locations into {DB_PATH}")


if __name__ == "__main__":
    main()
