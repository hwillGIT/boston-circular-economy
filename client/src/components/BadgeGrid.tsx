import { useEffect, useState } from 'react';
import { BADGES, getEarnedBadges, getNextBadge } from '../lib/badges';
import type { Badge } from '../lib/badges';
import './BadgeGrid.css';

interface Props {
  items: number;
  co2: number;
  repairs: number;
}

export default function BadgeGrid({ items, co2, repairs }: Props) {
  const [earnedIds, setEarnedIds] = useState<string[]>([]);
  const [nextBadge, setNextBadge] = useState<{
    badge: Badge;
    progress: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    setEarnedIds(getEarnedBadges(items, co2, repairs));
    setNextBadge(getNextBadge(items, co2, repairs));
  }, [items, co2, repairs]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="badge-section-container">
      <div
        className="badge-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? 'var(--space-4)' : '0',
        }}
      >
        <h3 className="badge-section-title" style={{ marginBottom: 0 }}>
          🏆 Badges: {earnedIds.length} of {BADGES.length} earned
        </h3>
        <span style={{ color: 'var(--text-secondary)' }}>{isExpanded ? '[↓]' : '[→]'}</span>
      </div>

      {isExpanded && (
        <>
          <div className="badge-grid">
            {BADGES.map((badge) => {
              const isEarned = earnedIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
                  title={`${badge.name}: ${badge.description}`}
                >
                  <div className="badge-icon">{badge.emoji}</div>
                  <div className="badge-tooltip">
                    <strong>{badge.name}</strong>
                    <p>{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {nextBadge && (
            <div className="next-badge-container">
              <div className="next-badge-info">
                <span className="next-badge-label">
                  Next Badge: <strong>{nextBadge.badge.name}</strong>
                </span>
                <span className="next-badge-progress-text">
                  {Math.floor(nextBadge.progress)} / {nextBadge.total}
                </span>
              </div>
              <div className="next-badge-progress-bar">
                <div
                  className="next-badge-progress-fill"
                  style={{ width: `${(nextBadge.progress / nextBadge.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
