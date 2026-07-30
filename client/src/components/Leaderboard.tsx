import './Leaderboard.css';

const NEIGHBORHOODS = [
  { name: 'Jamaica Plain', items: 342, co2: 1567 },
  { name: 'Allston-Brighton', items: 298, co2: 1234 },
  { name: 'Dorchester', items: 276, co2: 1189 },
  { name: 'Somerville', items: 245, co2: 1023 },
  { name: 'Cambridge', items: 234, co2: 987 },
  { name: 'South End', items: 198, co2: 876 },
  { name: 'Roxbury', items: 187, co2: 798 },
  { name: 'East Boston', items: 165, co2: 654 },
  { name: 'Back Bay', items: 143, co2: 567 },
  { name: 'Charlestown', items: 128, co2: 498 },
];

const SIDEBAR_LIMIT = 5;

export default function Leaderboard() {
  const currentUserNeighborhood = 'Jamaica Plain';
  const visible = NEIGHBORHOODS.slice(0, SIDEBAR_LIMIT);

  return (
    <div className="leaderboard-container">
      <h3 className="leaderboard-title">Neighborhood Leaderboard</h3>
      <div className="leaderboard-list">
        {visible.map((neighborhood, index) => {
          let rankIcon = '';
          if (index === 0) rankIcon = '🥇';
          else if (index === 1) rankIcon = '🥈';
          else if (index === 2) rankIcon = '🥉';
          else rankIcon = `#${index + 1}`;

          const isUser = neighborhood.name === currentUserNeighborhood;

          return (
            <div
              key={neighborhood.name}
              className={`leaderboard-item ${isUser ? 'user-neighborhood' : ''}`}
            >
              <div className="leaderboard-rank">{rankIcon}</div>
              <div className="leaderboard-name">
                {neighborhood.name} {isUser && '(You)'}
              </div>
              <div className="leaderboard-stats">
                <span className="leaderboard-items">{neighborhood.items} items</span>
                <span className="leaderboard-co2">{neighborhood.co2} lbs CO₂</span>
              </div>
            </div>
          );
        })}
      </div>
      {NEIGHBORHOODS.length > SIDEBAR_LIMIT && (
        <button className="leaderboard-view-all">
          View all {NEIGHBORHOODS.length} neighborhoods →
        </button>
      )}
    </div>
  );
}
