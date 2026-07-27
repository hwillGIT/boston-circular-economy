# Google Places API

These are some example queries and results from the Google Places API. The API allows you to search for places (like restaurants, parks, etc.) and get details about them. 

Note: The API offers only 20 results per query, so if you want to get more results, you need to use pagination with the `next_page_token` provided in the response.

## Terms used in this document

- **Google Places API** — a Google service for searching and retrieving details about real-world locations; used here as a data source for circular-economy locations.
- **data source** — an external provider of location data that the ETL pipeline fetches records from. Google Places is one data source; OpenStreetMap is another.
- **pagination / next_page_token** — the mechanism for fetching additional pages of results when a query returns more than the per-page limit (20 results for this API). Pass the token from one response as input to the next request.
