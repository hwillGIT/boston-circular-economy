import { useCallback, useEffect, useId, useState } from 'react';
import { MapFacade } from '../lib/map/MapFacade';
import { MARKER_COLORS } from '../lib/types';
import './MapView.css';

interface LocationData {
  id: number;
  lat: number;
  lng: number;
  type: string;
  name: string;
}

interface MapViewProps {
  locations: LocationData[];
  onMarkerClick?: (locationId: number) => void;
  onMapMove?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  selectedLocationId?: number | null;
  hoveredLocationId?: number | null;
  className?: string;
}

export default function MapView({
  locations,
  onMarkerClick,
  onMapMove,
  selectedLocationId,
  hoveredLocationId,
  className = '',
}: MapViewProps) {
  const mapContainerId = useId();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const initializeMap = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;

    try {
      MapFacade.init(container.id);
      setInitError(null);
    } catch (err) {
      console.error('Failed to initialize map', err);
      setInitError('Could not load the map. Please try refreshing.');
    }
    setIsInitializing(false);

    return () => MapFacade.destroy();
  }, []);

  useEffect(() => {
    if (isInitializing || initError) return;

    MapFacade.addMarkers(locations, MARKER_COLORS);

    if (onMarkerClick) {
      MapFacade.onMarkerClick(onMarkerClick);
    }

    if (onMapMove) {
      MapFacade.onMapMove(onMapMove);
    }
  }, [locations, isInitializing, initError, onMarkerClick, onMapMove]);

  useEffect(() => {
    if (isInitializing || initError) return;

    if (hoveredLocationId) {
      MapFacade.highlightMarker(hoveredLocationId);
    } else {
      MapFacade.clearHighlight();
    }
  }, [hoveredLocationId, isInitializing, initError]);

  useEffect(() => {
    if (isInitializing || initError || !selectedLocationId) return;

    const selectedLoc = locations.find((l) => l.id === selectedLocationId);
    if (selectedLoc) {
      MapFacade.flyTo(selectedLoc.lat, selectedLoc.lng, 16);
    }
  }, [selectedLocationId, locations, isInitializing, initError]);

  return (
    <div className={`map-view-wrapper ${className}`}>
      {isInitializing && <div className="map-view-shimmer">Loading map...</div>}
      {initError && (
        <div className="map-view-error">
          <p>{initError}</p>
        </div>
      )}
      <div
        id={mapContainerId}
        ref={initializeMap}
        className="map-view-container"
        style={{ visibility: isInitializing || initError ? 'hidden' : 'visible' }}
      />
    </div>
  );
}
