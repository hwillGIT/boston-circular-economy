/**
 * @module useExploreLocations
 * @description Custom hook for managing state, data fetching, and filtering logic for the Explore page.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllLocations } from '../lib/api';
import type { Location } from '../lib/types';
import { findNearestStation, getNearbyLines } from '../lib/mbta';

export function useExploreLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [activeMBTA, setActiveMBTA] = useState('all');

  // Selection
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Map Bounds
  const [mapMoved, setMapMoved] = useState(false);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const [boundsFilter, setBoundsFilter] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  // Fetch locations and enrich with MBTA proximity
  useEffect(() => {
    setLoading(true);
    getAllLocations()
      .then((locs) => {
        // Enrich each location with nearest MBTA station
        const enriched = locs.map((loc) => {
          const nearest = findNearestStation(loc.lat, loc.lng);
          if (nearest) {
            return {
              ...loc,
              mbta_line: nearest.line,
              mbta_station: nearest.name,
              walk_minutes: nearest.walkMinutes,
            };
          }
          return loc;
        });
        setLocations(enriched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Derive unique activities from data
  const activityFilters = useMemo(() => {
    const activities = new Map<string, number>();
    for (const loc of locations) {
      if (loc.activities) {
        for (const a of loc.activities) {
          activities.set(a, (activities.get(a) || 0) + 1);
        }
      }
    }
    return Array.from(activities.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, count }));
  }, [locations]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    let result = locations;

    if (boundsFilter) {
      result = result.filter(
        (l) =>
          l.lat <= boundsFilter.north &&
          l.lat >= boundsFilter.south &&
          l.lng <= boundsFilter.east &&
          l.lng >= boundsFilter.west,
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.address?.toLowerCase().includes(q) ||
          l.activities?.some((a) => a.toLowerCase().includes(q)),
      );
    }

    if (activeActivity) {
      result = result.filter((l) => l.activities?.includes(activeActivity));
    }

    if (activeMBTA !== 'all') {
      result = result.filter((l) => {
        const lines = getNearbyLines(l.lat, l.lng);
        return lines.includes(activeMBTA);
      });
    }

    return result;
  }, [locations, searchQuery, activeActivity, activeMBTA, boundsFilter]);

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedId) || null,
    [locations, selectedId],
  );

  const handleMarkerClick = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleCardClick = useCallback((loc: Location) => {
    setSelectedId(loc.id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleMapMove = useCallback(
    (bounds: { north: number; south: number; east: number; west: number }) => {
      setMapBounds(bounds);
      setMapMoved(true);
    },
    [],
  );

  const handleSearchArea = useCallback(() => {
    if (mapBounds) {
      setBoundsFilter(mapBounds);
      setMapMoved(false);
    }
  }, [mapBounds]);

  // Reset bounds filter when other filters change
  useEffect(() => {
    setBoundsFilter(null);
    setMapMoved(false);
  }, [searchQuery, activeActivity, activeMBTA]);

  return {
    locations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeActivity,
    setActiveActivity,
    activeMBTA,
    setActiveMBTA,
    selectedId,
    setSelectedId,
    hoveredId,
    setHoveredId,
    showActivityForm,
    setShowActivityForm,
    mapMoved,
    handleSearchArea,
    activityFilters,
    filteredLocations,
    selectedLocation,
    handleMarkerClick,
    handleCardClick,
    handleCloseDetail,
    handleMapMove,
  };
}
