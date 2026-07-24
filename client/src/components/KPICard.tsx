import React, { useEffect, useState, useRef } from 'react';
import './KPICard.css';

export interface KPICardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  icon: string;
  accentColor?: string;
  /** Educational tooltip text shown when the info icon is tapped/hovered */
  tooltip?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit = '',
  trend,
  trendDirection,
  icon,
  accentColor = 'var(--color-primary, #1a73e8)',
  tooltip,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Close tooltip on outside tap (mobile)
  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTooltip]);

  const formatValue = (num: number, u: string): string => {
    if (u === '$') {
      return num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return num.toLocaleString('en-US');
  };

  const isPositiveTrend = trendDirection === 'up';
  
  // Render the unit label separately from the number to avoid
  // subscript characters (like ₂ in CO₂) leaking into the value
  const displayUnit = unit === '$' ? '' : unit;

  return (
    <div 
      className="kpi-card"
      style={{ '--kpi-accent': accentColor } as React.CSSProperties}
    >
      <div className="kpi-card-header">
        <span className="kpi-card-label">{label}</span>
        <div className="kpi-card-header-right">
          {tooltip && (
            <div className="kpi-info-wrapper" ref={tooltipRef}>
              <button
                className="kpi-info-btn"
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label={`Learn more about ${label}`}
                aria-expanded={showTooltip}
              >
                ⓘ
              </button>
              {showTooltip && (
                <div className="kpi-tooltip" role="tooltip">
                  <div className="kpi-tooltip-arrow" />
                  <p className="kpi-tooltip-text">{tooltip}</p>
                </div>
              )}
            </div>
          )}
          <div className="kpi-card-icon">{icon}</div>
        </div>
      </div>
      
      <div className="kpi-card-value-container">
        <span 
          className={`kpi-card-value ${mounted ? 'animate' : ''}`}
          style={{ '--target-num': value } as React.CSSProperties}
        >
          {formatValue(value, unit)}
        </span>
        {displayUnit && <span className="kpi-card-unit">{displayUnit}</span>}
      </div>

      {trend !== undefined && (
        <div className={`kpi-card-trend ${isPositiveTrend ? 'is-up' : 'is-down'}`}>
          <span className="kpi-card-trend-icon">
            {isPositiveTrend ? '↑' : '↓'}
          </span>
          <span className="kpi-card-trend-value">{trend}%</span>
          <span className="kpi-card-trend-text">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
