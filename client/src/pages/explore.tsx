import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllLocations } from '../lib/api'
import type { Location } from '../lib/types'
import { MARKER_COLORS, MARKER_LABELS, MBTA_LINES } from '../lib/types'
import { findNearestStation, getNearbyLines } from '../lib/mbta'
import MapView from '../components/MapView'
import LocationCard from '../components/LocationCard'
import LocationDetail from '../components/LocationDetail'
import ActivityLogForm from '../components/ActivityLogForm'
import CategoryChip from '../components/CategoryChip'
import './Explore.css'

export const Route = createFileRoute('/explore')({
  component: ExplorePage,
})

function ExplorePage() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [activeMBTA, setActiveMBTA] = useState('all')

  // Selection
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showActivityForm, setShowActivityForm] = useState(false)

  // Map Bounds
  const [mapMoved, setMapMoved] = useState(false)
  const [mapBounds, setMapBounds] = useState<{north: number, south: number, east: number, west: number} | null>(null)
  const [boundsFilter, setBoundsFilter] = useState<{north: number, south: number, east: number, west: number} | null>(null)

  // Fetch locations and enrich with MBTA proximity
  useEffect(() => {
    setLoading(true)
    getAllLocations()
      .then(locs => {
        // Enrich each location with nearest MBTA station
        const enriched = locs.map(loc => {
          const nearest = findNearestStation(loc.lat, loc.lng)
          if (nearest) {
            return {
              ...loc,
              mbta_line: nearest.line,
              mbta_station: nearest.name,
              walk_minutes: nearest.walkMinutes,
            }
          }
          return loc
        })
        setLocations(enriched)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Derive unique activities from data
  const activityFilters = useMemo(() => {
    const activities = new Map<string, number>()
    for (const loc of locations) {
      if (loc.activities) {
        for (const a of loc.activities) {
          activities.set(a, (activities.get(a) || 0) + 1)
        }
      }
    }
    return Array.from(activities.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, count }))
  }, [locations])

  // Filter locations
  const filteredLocations = useMemo(() => {
    let result = locations

    if (boundsFilter) {
      result = result.filter(l => 
        l.lat <= boundsFilter.north && 
        l.lat >= boundsFilter.south && 
        l.lng <= boundsFilter.east && 
        l.lng >= boundsFilter.west
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        l =>
          l.name?.toLowerCase().includes(q) ||
          l.address?.toLowerCase().includes(q) ||
          l.activities?.some(a => a.toLowerCase().includes(q))
      )
    }

    if (activeActivity) {
      result = result.filter(l =>
        l.activities?.includes(activeActivity)
      )
    }

    if (activeMBTA !== 'all') {
      result = result.filter(l => {
        const lines = getNearbyLines(l.lat, l.lng)
        return lines.includes(activeMBTA)
      })
    }

    return result
  }, [locations, searchQuery, activeActivity, activeMBTA, boundsFilter])

  const selectedLocation = useMemo(
    () => locations.find(l => l.id === selectedId) || null,
    [locations, selectedId]
  )

  const handleMarkerClick = useCallback((id: number) => {
    setSelectedId(id)
  }, [])

  const handleCardClick = useCallback((loc: Location) => {
    setSelectedId(loc.id)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleMapMove = useCallback((bounds: {north: number, south: number, east: number, west: number}) => {
    setMapBounds(bounds)
    setMapMoved(true)
  }, [])

  const handleSearchArea = useCallback(() => {
    if (mapBounds) {
      setBoundsFilter(mapBounds)
      setMapMoved(false)
    }
  }, [mapBounds])

  // Reset bounds filter when other filters change
  useEffect(() => {
    setBoundsFilter(null)
    setMapMoved(false)
  }, [searchQuery, activeActivity, activeMBTA])

  const formatActivity = (a: string) =>
    a.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="explore-page">
      {/* ── Sidebar ── */}
      <aside className="explore-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-top-row">
            <button className="sidebar-back" onClick={() => navigate({ to: '/' })}>
              ← Back
            </button>
          </div>

          <h2 className="sidebar-title">
            Locations
            <span className="sidebar-count">{filteredLocations.length}</span>
          </h2>

          {/* Search */}
          <div className="sidebar-search">
            <span className="sidebar-search-icon">🔍</span>
            <input
              className="sidebar-search-input"
              type="text"
              placeholder="Search locations, activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Activity filters */}
          <div className="sidebar-filters">
            <CategoryChip
              label="All"
              active={activeActivity === null}
              onClick={() => setActiveActivity(null)}
              count={locations.length}
            />
            {activityFilters.slice(0, 8).map(f => (
              <CategoryChip
                key={f.key}
                label={formatActivity(f.key)}
                active={activeActivity === f.key}
                onClick={() =>
                  setActiveActivity(activeActivity === f.key ? null : f.key)
                }
                count={f.count}
              />
            ))}
          </div>

          {/* MBTA filter */}
          <select
            className="sidebar-search-input"
            style={{ paddingLeft: '14px', marginTop: '8px' }}
            value={activeMBTA}
            onChange={e => setActiveMBTA(e.target.value)}
          >
            {MBTA_LINES.map(line => (
              <option key={line.key} value={line.key}>
                {line.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location list */}
        <div className="sidebar-list">
          {loading ? (
            <div className="sidebar-loading" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line address"></div>
                  <div className="skeleton-line tags"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="sidebar-empty">
              <div className="sidebar-empty-icon">⚠️</div>
              <p className="sidebar-empty-text">Could not load locations</p>
              <p className="sidebar-empty-sub">{error}</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="sidebar-empty">
              <div className="sidebar-empty-icon" style={{ fontSize: '4rem' }}>🗺️</div>
              <p className="sidebar-empty-text">No locations match your filters in this area</p>
              <p className="sidebar-empty-sub">
                Try broadening your search
              </p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveActivity(null);
                  setActiveMBTA('all');
                }}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'var(--color-primary)',
                  color: 'var(--text-inverse)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                onClick={() => handleCardClick(loc)}
                onMouseEnter={() => setHoveredId(loc.id)}
                onMouseLeave={() => setHoveredId(null)}
                isHovered={hoveredId === loc.id}
                isSelected={selectedId === loc.id}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Map ── */}
      <div className="explore-map">
        {mapMoved && (
          <button className="search-area-btn" onClick={handleSearchArea}>
            🔍 Search this area
          </button>
        )}
        <MapView
          locations={filteredLocations}
          onMarkerClick={handleMarkerClick}
          onMapMove={handleMapMove}
          selectedLocationId={selectedId}
          hoveredLocationId={hoveredId}
          className="explore-map-container"
        />

        {/* Legend */}
        <div className="map-legend">
          <div className="map-legend-title">Legend</div>
          {Object.entries(MARKER_LABELS).map(([key, label]) => (
            <div key={key} className="map-legend-item">
              <div
                className="map-legend-dot"
                style={{ backgroundColor: MARKER_COLORS[key] }}
              />
              {label}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedLocation && (
          <div className={`explore-detail-overlay ${selectedLocation ? 'open' : ''}`}>
            <LocationDetail
              location={selectedLocation}
              onClose={handleCloseDetail}
              onLogActivity={() => setShowActivityForm(true)}
            />
          </div>
        )}
      </div>

      {/* Activity Log Form Modal — outside map stacking context */}
      {showActivityForm && (
        <ActivityLogForm
          location={selectedLocation}
          onClose={() => setShowActivityForm(false)}
          onSuccess={() => {
            setShowActivityForm(false)
            handleCloseDetail()
          }}
        />
      )}
    </div>
  )
}
