import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { MapProvider, MapOptions } from './MapProviderInterface';

export class LeafletProvider implements MapProvider {
  private map: L.Map | null = null;
  private markers: Map<number, L.CircleMarker> = new Map();
  private routeLayer: L.Polyline | null = null;
  private markerClickHandler?: (id: number) => void;
  private mapMoveHandler?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  private highlightedMarkerId: number | null = null;
  private originalHighlightStyle: L.CircleMarkerOptions | null = null;

  init(containerId: string, options?: MapOptions): void {
    if (this.map) return;

    const center = options?.center || [42.3601, -71.0589];
    const zoom = options?.zoom || 13;

    this.map = L.map(containerId, {
      zoomControl: false, // We can add custom position if needed
      minZoom: options?.minZoom,
      maxZoom: options?.maxZoom,
    }).setView(center, zoom);

    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap, &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on('moveend', () => {
      if (this.mapMoveHandler && this.map) {
        const bounds = this.map.getBounds();
        this.mapMoveHandler({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    });
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers.clear();
    this.routeLayer = null;
    this.clearHighlight();
  }

  addMarkers(
    locations: Array<{ id: number; lat: number; lng: number; type: string; name: string }>,
    colorMap: Record<string, string>,
  ): void {
    if (!this.map) return;

    this.clearMarkers();

    // Create a cluster-like feel at low zoom levels by just rendering smaller dots,
    // and expanding them at higher zooms.
    locations.forEach((loc) => {
      const color = colorMap[loc.type] || colorMap.default || '#64748B';

      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 8,
        weight: 2,
        color: '#ffffff', // white border
        fillColor: color,
        fillOpacity: 1,
        className: 'custom-leaflet-marker', // For CSS micro-animations if needed
      });

      marker.bindTooltip(loc.name, {
        direction: 'top',
        offset: [0, -10],
        opacity: 0.9,
      });

      marker.on('click', () => {
        if (this.markerClickHandler) {
          this.markerClickHandler(loc.id);
        }
      });

      if (this.map) {
        marker.addTo(this.map);
      }
      this.markers.set(loc.id, marker);
    });
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => {
      if (this.map) {
        marker.remove();
      }
    });
    this.markers.clear();
    this.clearHighlight();
  }

  flyTo(lat: number, lng: number, zoom = 15): void {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 1.5, // seconds
      });
    }
  }

  fitBounds(locations: Array<{ lat: number; lng: number }>, padding = 50): void {
    if (!this.map || locations.length === 0) return;

    const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
    this.map.fitBounds(bounds, { padding: [padding, padding] });
  }

  async showRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<void> {
    if (!this.map) return;

    this.clearRoute();

    try {
      // OSRM expects coordinates in lng,lat format
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/walking/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`,
      );
      if (!response.ok) throw new Error('Route calculation failed');

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ]); // Convert back to lat,lng

        this.routeLayer = L.polyline(coordinates, {
          color: '#3B82F6', // Blue route
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
          lineJoin: 'round',
        }).addTo(this.map);

        this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
      }
    } catch (err) {
      console.error('Error fetching route:', err);
    }
  }

  clearRoute(): void {
    if (this.routeLayer && this.map) {
      this.routeLayer.remove();
      this.routeLayer = null;
    }
  }

  highlightMarker(locationId: number): void {
    if (this.highlightedMarkerId === locationId) return;

    this.clearHighlight();

    const marker = this.markers.get(locationId);
    if (marker && this.map) {
      this.highlightedMarkerId = locationId;

      // Save original style so we can restore it
      this.originalHighlightStyle = {
        radius: marker.getRadius(),
        weight: marker.options.weight,
        fillOpacity: marker.options.fillOpacity,
      };

      // Enlarge the marker in-place — no separate overlay that can drift
      marker.setRadius(14);
      marker.setStyle({
        weight: 3,
        fillOpacity: 0.85,
      });
      marker.bringToFront();
    }
  }

  clearHighlight(): void {
    if (this.highlightedMarkerId !== null && this.originalHighlightStyle) {
      const marker = this.markers.get(this.highlightedMarkerId);
      if (marker) {
        marker.setRadius((this.originalHighlightStyle.radius as number) ?? 8);
        marker.setStyle({
          weight: this.originalHighlightStyle.weight ?? 2,
          fillOpacity: this.originalHighlightStyle.fillOpacity ?? 1,
        });
      }
    }
    this.highlightedMarkerId = null;
    this.originalHighlightStyle = null;
  }

  onMarkerClick(callback: (locationId: number) => void): void {
    this.markerClickHandler = callback;
  }

  onMapMove(
    callback: (bounds: { north: number; south: number; east: number; west: number }) => void,
  ): void {
    this.mapMoveHandler = callback;
  }

  getProviderName(): string {
    return 'leaflet';
  }
}
