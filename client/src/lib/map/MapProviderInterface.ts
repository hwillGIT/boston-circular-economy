export interface MapOptions {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface MapProvider {
  init(containerId: string, options?: MapOptions): void;
  destroy(): void;
  addMarkers(
    locations: Array<{ id: number; lat: number; lng: number; type: string; name: string }>,
    colorMap: Record<string, string>,
  ): void;
  clearMarkers(): void;
  flyTo(lat: number, lng: number, zoom?: number): void;
  fitBounds(locations: Array<{ lat: number; lng: number }>, padding?: number): void;
  showRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<void>;
  clearRoute(): void;
  highlightMarker(locationId: number): void;
  clearHighlight(): void;
  onMarkerClick(callback: (locationId: number) => void): void;
  onMapMove(
    callback: (bounds: { north: number; south: number; east: number; west: number }) => void,
  ): void;
  getProviderName(): string;
}
