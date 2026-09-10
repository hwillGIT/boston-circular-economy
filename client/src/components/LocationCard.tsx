import React from 'react';
import type { Location } from '../lib/types';
import './LocationCard.css';

export interface LocationCardProps {
  location: Location;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  isSelected?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered = false,
  isSelected = false,
}) => {
  let isOpen = null;
  const hours = location.hours;
  if (hours) {
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = hours.split('; ').find((d: string) => d.startsWith(todayStr));
    if (todayHours) {
      if (todayHours.includes('Closed')) {
        isOpen = false;
      } else {
        isOpen = true;
      }
    }
  }

  return (
    <div
      className={`location-card ${isHovered ? 'is-hovered' : ''} ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div className="location-card-header">
        <h3 className="location-card-name">{location.name}</h3>
        <span className="location-card-type">{location.type}</span>
      </div>

      {hours && (
        <div
          className={`location-card-hours ${isOpen === true ? 'is-open' : isOpen === false ? 'is-closed' : ''}`}
        >
          <span className="location-card-hours-dot"></span>
          <span className="location-card-hours-label">
            {isOpen === true ? 'Open' : isOpen === false ? 'Closed' : 'Hours available'}
          </span>
        </div>
      )}

      <p className="location-card-address">{location.address}</p>

      <div className="location-card-activities">
        {(location.activities || []).map((activity, idx) => (
          <span key={idx} className="location-card-activity-tag">
            {activity.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        ))}
      </div>

      <div className="location-card-footer">
        <div className="location-card-source">
          <span className="location-card-source-icon" aria-hidden="true">
            ✓
          </span>
          {location.source === 'bcyf'
            ? 'BCYF Center'
            : location.type === 'community'
              ? 'Community location'
              : 'Professional service'}
        </div>
        {location.cost_tier && <span className="location-card-cost">{location.cost_tier}</span>}

        <div className="location-card-meta">
          {location.walk_minutes && location.mbta_station && (
            <span className="location-card-transit">
              🚶 {location.walk_minutes}m from {location.mbta_station}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
