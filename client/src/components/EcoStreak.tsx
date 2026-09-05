import { useState } from 'react';
import { getStreakData, getCurrentWeek } from '../lib/streaks';
import './EcoStreak.css';

export default function EcoStreak() {
  const [streakData] = useState(getStreakData);

  const currentWeek = getCurrentWeek();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 - i) * 7);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  });

  // Ensure current week is at the end
  weeks[7] = currentWeek;

  return (
    <div className="eco-streak-container">
      <div className="eco-streak-header">
        <div className={`eco-streak-flame ${streakData.currentStreak > 0 ? 'active' : ''}`}>🔥</div>
        <div className="eco-streak-text">
          {streakData.currentStreak > 0 ? (
            <h3 className="eco-streak-title">{streakData.currentStreak} week streak!</h3>
          ) : (
            <h3 className="eco-streak-title">Start your streak this week!</h3>
          )}
          <p className="eco-streak-subtitle">Longest: {streakData.longestStreak} weeks</p>
        </div>
      </div>
      <div className="eco-streak-calendar">
        {weeks.map((week) => (
          <div
            key={week}
            className={`eco-streak-day ${streakData.weeklyHistory.includes(week) ? 'active' : ''}`}
            title={week}
          />
        ))}
      </div>
    </div>
  );
}
