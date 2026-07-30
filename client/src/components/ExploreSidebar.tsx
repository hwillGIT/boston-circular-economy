/**
 * @module ExploreSidebar
 * @description Sidebar component for the Explore page, containing search, filters, and the location list.
 */
import { useNavigate } from '@tanstack/react-router';
import CategoryChip from './CategoryChip';
import LocationCard from './LocationCard';
import { MBTA_LINES } from '../lib/types';
import type { Location } from '../lib/types';
import '../styles/forms.css';

interface ExploreSidebarProps {
  navigate: ReturnType<typeof useNavigate>;
  locationsLength: number;
  filteredLocations: Location[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeActivity: string | null;
  setActiveActivity: (activity: string | null) => void;
  activeMBTA: string;
  setActiveMBTA: (mbta: string) => void;
  activityFilters: { key: string; count: number }[];
  loading: boolean;
  error: string | null;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  selectedId: number | null;
  handleCardClick: (loc: Location) => void;
}

const formatActivity = (a: string) => a.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function ExploreSidebar({
  navigate,
  locationsLength,
  filteredLocations,
  searchQuery,
  setSearchQuery,
  activeActivity,
  setActiveActivity,
  activeMBTA,
  setActiveMBTA,
  activityFilters,
  loading,
  error,
  hoveredId,
  setHoveredId,
  selectedId,
  handleCardClick,
}: ExploreSidebarProps) {
  return (
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
            className="sidebar-search-input form-input"
            type="text"
            placeholder="Search locations, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Activity filters */}
        <div className="sidebar-filters">
          <CategoryChip
            label="All"
            active={activeActivity === null}
            onClick={() => setActiveActivity(null)}
            count={locationsLength}
          />
          {activityFilters.slice(0, 8).map((f) => (
            <CategoryChip
              key={f.key}
              label={formatActivity(f.key)}
              active={activeActivity === f.key}
              onClick={() => setActiveActivity(activeActivity === f.key ? null : f.key)}
              count={f.count}
            />
          ))}
        </div>

        {/* MBTA filter */}
        <select
          className="sidebar-search-input form-input"
          style={{ paddingLeft: '14px', marginTop: '8px' }}
          value={activeMBTA}
          onChange={(e) => setActiveMBTA(e.target.value)}
        >
          {MBTA_LINES.map((line) => (
            <option key={line.key} value={line.key}>
              {line.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location list */}
      <div className="sidebar-list">
        {loading ? (
          <div
            className="sidebar-loading"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}
          >
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
            <div className="sidebar-empty-icon" style={{ fontSize: '4rem' }}>
              🗺️
            </div>
            <p className="sidebar-empty-text">No locations match your filters in this area</p>
            <p className="sidebar-empty-sub">Try broadening your search</p>
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
                cursor: 'pointer',
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
  );
}
