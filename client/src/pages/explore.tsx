import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MARKER_COLORS, MARKER_LABELS } from '../lib/types';
import MapView from '../components/MapView';
import LocationDetail from '../components/LocationDetail';
import ActivityLogForm from '../components/ActivityLogForm';
import ExploreSidebar from '../components/ExploreSidebar';
import { useExploreLocations } from '../hooks/useExploreLocations';
import '../styles/forms.css';
import './Explore.css';

export const Route = createFileRoute('/explore')({
  component: ExplorePage,
});

function ExplorePage() {
  const navigate = useNavigate();
  const hook = useExploreLocations();

  return (
    <div className="explore-page">
      <ExploreSidebar
        navigate={navigate}
        locationsLength={hook.locations.length}
        filteredLocations={hook.filteredLocations}
        searchQuery={hook.searchQuery}
        setSearchQuery={hook.setSearchQuery}
        activeActivity={hook.activeActivity}
        setActiveActivity={hook.setActiveActivity}
        activeMBTA={hook.activeMBTA}
        setActiveMBTA={hook.setActiveMBTA}
        activityFilters={hook.activityFilters}
        loading={hook.loading}
        error={hook.error}
        hoveredId={hook.hoveredId}
        setHoveredId={hook.setHoveredId}
        selectedId={hook.selectedId}
        handleCardClick={hook.handleCardClick}
      />

      {/* ── Map ── */}
      <div className="explore-map">
        {hook.mapMoved && (
          <button className="search-area-btn" onClick={hook.handleSearchArea}>
            🔍 Search this area
          </button>
        )}
        <MapView
          locations={hook.filteredLocations}
          onMarkerClick={hook.handleMarkerClick}
          onMapMove={hook.handleMapMove}
          selectedLocationId={hook.selectedId}
          hoveredLocationId={hook.hoveredId}
          className="explore-map-container"
        />

        {/* Legend */}
        <div className="map-legend">
          <div className="map-legend-title">Legend</div>
          {Object.entries(MARKER_LABELS).map(([key, label]) => (
            <div key={key} className="map-legend-item">
              <div
                className="map-legend-dot"
                style={{ backgroundColor: MARKER_COLORS[key as keyof typeof MARKER_COLORS] }}
              />
              {label}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {hook.selectedLocation && (
          <div className={`explore-detail-overlay ${hook.selectedLocation ? 'open' : ''}`}>
            <LocationDetail
              location={hook.selectedLocation}
              onClose={hook.handleCloseDetail}
              onLogActivity={() => hook.setShowActivityForm(true)}
            />
          </div>
        )}
      </div>

      {/* Activity Log Form Modal — outside map stacking context */}
      {hook.showActivityForm && (
        <ActivityLogForm
          location={hook.selectedLocation}
          onClose={() => hook.setShowActivityForm(false)}
          onSuccess={() => {
            hook.setShowActivityForm(false);
            hook.handleCloseDetail();
          }}
        />
      )}
    </div>
  );
}
