import React from 'react';
import './OptionCard.css';

export interface OptionCardProps {
  title: string;
  badge?: string;
  badgeType?: 'recommended' | 'fastest' | 'sustainable' | 'swap' | 'free';
  cost: number | string;
  savings?: number;
  time: string;
  co2?: number;
  lbsDiverted?: number;
  credits?: number;
  helpedCount?: number;
  communityVetted?: boolean;
  onSelect: () => void;
  selected?: boolean;
  index?: number; // for staggered animation
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  badge,
  badgeType = 'recommended',
  cost,
  savings,
  time,
  co2,
  credits,
  helpedCount,
  communityVetted,
  onSelect,
  selected = false,
  index = 0,
}) => {
  const isFree = cost === 0 || cost === 'Free';
  const displayCost = isFree ? 'Free' : typeof cost === 'number' ? `$${cost}` : cost;

  return (
    <button
      className={`option-card ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
      style={{ '--i': index } as React.CSSProperties}
      aria-pressed={selected}
    >
      <div className="option-card-header">
        <h3 className="option-card-title">{title}</h3>
        {badge && (
          <span className={`option-card-badge option-card-badge--${badgeType}`}>{badge}</span>
        )}
      </div>

      <div className="option-card-body">
        <div className="option-metric">
          <span className="option-metric-icon">💰</span>
          <div className="option-metric-content">
            <span className="option-metric-label">Cost</span>
            <span className={`option-metric-value ${isFree ? 'is-free' : ''}`}>{displayCost}</span>
          </div>
        </div>

        {savings && (
          <div className="option-metric">
            <span className="option-metric-icon">💵</span>
            <div className="option-metric-content">
              <span className="option-metric-label">Savings</span>
              <span className="option-metric-value positive">${savings}</span>
            </div>
          </div>
        )}

        <div className="option-metric">
          <span className="option-metric-icon">⏱️</span>
          <div className="option-metric-content">
            <span className="option-metric-label">Time</span>
            <span className="option-metric-value">{time}</span>
          </div>
        </div>

        {co2 !== undefined && (
          <div className="option-metric">
            <span className="option-metric-icon">🌱</span>
            <div className="option-metric-content">
              <span className="option-metric-label">CO₂ Avoided</span>
              <span className="option-metric-value positive">{co2} lbs</span>
            </div>
          </div>
        )}

        {credits !== undefined && (
          <div className="option-metric">
            <span className="option-metric-icon">⭐</span>
            <div className="option-metric-content">
              <span className="option-metric-label">Credits</span>
              <span className="option-metric-value highlight">+{credits}</span>
            </div>
          </div>
        )}
      </div>

      {(helpedCount || communityVetted) && (
        <div className="option-card-footer">
          {helpedCount && (
            <span className="option-social-proof">👥 {helpedCount} neighbors helped</span>
          )}
          {communityVetted && <span className="option-vetted">✓ Community Vetted</span>}
        </div>
      )}
    </button>
  );
};

export default OptionCard;
