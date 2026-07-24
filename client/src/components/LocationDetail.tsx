import React from 'react';
import type { Location } from '../lib/types';
import './LocationDetail.css';

export interface LocationDetailProps {
  location: Location;
  onClose: () => void;
  onLogActivity: () => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onClose,
  onLogActivity,
}) => {
  // Determine badge based on type/source
  let badgeIcon = '🌱';
  let badgeText = 'Community';
  let badgeClass = 'badge-community';
  
  if (location.type === 'bcyf' || location.source === 'bcyf') {
    badgeIcon = '✓';
    badgeText = 'Municipal';
    badgeClass = 'badge-municipal';
  } else if (location.type === 'professional' || location.source === 'verified') {
    badgeIcon = '🛡️';
    badgeText = 'Verified Partner';
    badgeClass = 'badge-verified';
  }

  return (
    <>
      <div className="location-detail-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="location-detail-panel" role="dialog" aria-modal="true" aria-labelledby="location-detail-title">
        <div className="location-detail-header">
          <div>
            <div className={`location-trust-badge ${badgeClass}`}>
              <span className="badge-icon" aria-hidden="true">{badgeIcon}</span> {badgeText}
            </div>
            <h2 id="location-detail-title" className="location-detail-name">{location.name}</h2>
            <p className="location-detail-address">{location.address}</p>
          </div>
          <button 
            className="location-detail-close" 
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="location-detail-body">
          {location.description && (
            <p className="location-detail-description">{location.description}</p>
          )}

          <div className="location-quick-actions">
            <a href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="quick-action-pill">
              <span aria-hidden="true">📍</span> Directions
            </a>
            {location.phone && (
              <a href={`tel:${location.phone}`} className="quick-action-pill">
                <span aria-hidden="true">📞</span> Call
              </a>
            )}
            {location.website && (
              <a href={location.website} target="_blank" rel="noopener noreferrer" className="quick-action-pill">
                <span aria-hidden="true">🌐</span> Website
              </a>
            )}
          </div>

          <div className="location-detail-info-grid">
            {location.hours && (
              <div className="info-item">
                <span className="info-icon" aria-hidden="true">🕒</span>
                <span>{location.hours}</span>
              </div>
            )}
          </div>

          {location.features && location.features.length > 0 && (
            <div className="location-detail-section">
              <h4 className="section-title">Features</h4>
              <div className="feature-chips">
                {location.features.map((feature, idx) => (
                  <span key={idx} className="feature-chip">✓ {feature}</span>
                ))}
              </div>
            </div>
          )}

          <div className="location-detail-section">
            <h4 className="section-title">Activities Available</h4>
            <div className="activity-tags">
              {(location.activities || []).map((activity, idx) => (
                <span key={idx} className="activity-tag">{activity}</span>
              ))}
            </div>
          </div>

          {(location.co2_saved || location.credits || location.helped_count) && (
            <div className="location-detail-impact">
              <h4 className="section-title">Community Impact</h4>
              {location.helped_count && (
                <p className="social-proof">
                  <span aria-hidden="true">🌟</span> {location.helped_count} neighbors helped here
                </p>
              )}
              <div className="impact-metrics">
                {location.co2_saved && (
                  <div className="impact-metric">
                    <span className="impact-icon" aria-hidden="true">🌱</span>
                    <div>
                      <span className="impact-value">{location.co2_saved} lbs</span>
                      <span className="impact-label">CO₂ Saved</span>
                    </div>
                  </div>
                )}
                {location.credits && (
                  <div className="impact-metric">
                    <span className="impact-icon" aria-hidden="true">⭐</span>
                    <div>
                      <span className="impact-value">Up to {location.credits}</span>
                      <span className="impact-label">Boston Credits</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="location-detail-actions">
          <button className="btn btn-primary cta-log-activity" onClick={onLogActivity}>
            Log This Activity
          </button>
        </div>
      </div>
    </>
  );
};

export default LocationDetail;
