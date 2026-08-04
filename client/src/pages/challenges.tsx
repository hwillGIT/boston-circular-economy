import { createFileRoute } from '@tanstack/react-router';
import './Dashboard.css';

export const Route = createFileRoute('/challenges')({
  component: ChallengesPage,
});

function ChallengesPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">🏆 Challenges & Achievements</h1>
          <p className="dashboard-subtitle">
            Earn badges, climb the leaderboard, and complete neighborhood challenges
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-6)',
          }}
        >
          {/* Active Challenges */}
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
              🎯 Active Challenges
            </h3>
            {[
              {
                name: 'First Repair',
                desc: 'Log your first repair activity',
                progress: 0,
                total: 1,
                emoji: '🔧',
              },
              {
                name: 'Eco Starter',
                desc: 'Divert 5 items from landfill',
                progress: 4,
                total: 5,
                emoji: '♻️',
              },
              {
                name: 'Neighborhood Hero',
                desc: 'Log activities at 10 different locations',
                progress: 2,
                total: 10,
                emoji: '🦸',
              },
              {
                name: 'Carbon Crusher',
                desc: 'Prevent 50 lbs of CO₂',
                progress: 21,
                total: 50,
                emoji: '🌍',
              },
            ].map((c) => (
              <div
                key={c.name}
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  gap: 'var(--space-4)',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    {c.desc}
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: 'var(--border-color)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(c.progress / c.total) * 100}%`,
                        background: 'var(--color-green)',
                        borderRadius: 3,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}
                  >
                    {c.progress} / {c.total}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Campaigns */}
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
              📢 Campaigns
            </h3>
            {[
              {
                name: 'Zero Waste Week',
                dates: 'Aug 4–10',
                desc: 'City-wide challenge: divert as much as possible',
                badge: '🏅',
                status: 'Upcoming',
              },
              {
                name: 'Back Bay Repair Rally',
                dates: 'Aug 15',
                desc: 'Bring your broken items to Copley Square',
                badge: '🔧',
                status: 'Upcoming',
              },
              {
                name: 'Summer Swap Fest',
                dates: 'Jul 20',
                desc: 'Clothing swap at Boston Common',
                badge: '👕',
                status: 'Completed',
              },
            ].map((c) => (
              <div
                key={c.name}
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {c.badge} {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      background:
                        c.status === 'Upcoming' ? 'var(--color-green-light)' : 'var(--bg-hover)',
                      color:
                        c.status === 'Upcoming' ? 'var(--color-green-dark)' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    marginTop: 2,
                  }}
                >
                  {c.dates}
                </div>
                <div
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}
                >
                  {c.desc}
                </div>
              </div>
            ))}
          </section>

          {/* Badge Showcase */}
          <section
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
              🏅 Badge Collection
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-3)',
              }}
            >
              {[
                { emoji: '🌱', name: 'Seedling', earned: true },
                { emoji: '♻️', name: 'Recycler', earned: true },
                { emoji: '🔧', name: 'Fixer', earned: false },
                { emoji: '🌍', name: 'Eco Warrior', earned: false },
                { emoji: '🤝', name: 'Neighbor', earned: false },
                { emoji: '🔥', name: 'Streak Master', earned: false },
                { emoji: '🌳', name: 'Tree', earned: false },
                { emoji: '🌲', name: 'Forest', earned: false },
              ].map((b) => (
                <div
                  key={b.name}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: b.earned ? 'var(--color-green-light)' : 'var(--bg-hover)',
                    opacity: b.earned ? 1 : 0.4,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{b.emoji}</div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      marginTop: 2,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {b.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
