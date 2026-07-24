import { createFileRoute } from '@tanstack/react-router'
import './Dashboard.css'

export const Route = createFileRoute('/events')({
  component: EventsPage,
})

function EventsPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">📅 Events & Campaigns</h1>
          <p className="dashboard-subtitle">
            Community events, volunteer nights, repair cafés, and swap meets across Boston
          </p>
        </header>

        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">📅</div>
          <h3 className="dashboard-empty-title">Coming Soon</h3>
          <p className="dashboard-empty-sub">
            Community events and campaigns are being built. Local businesses will be able to
            host repair cafés, special events, swap meets, and more. Stay tuned!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-8)',
            maxWidth: '720px',
          }}>
            {[
              { emoji: '🔧', title: 'Repair Cafés', desc: 'Free fix-it clinics at BCYF centers' },
              { emoji: '👕', title: 'Swap Meets', desc: 'Clothing and gear exchange events' },
              { emoji: '🤝', title: 'Special Events', desc: 'Community volunteer and outreach events' },
              { emoji: '🌱', title: 'Eco Campaigns', desc: 'Neighborhood challenges with prizes' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{item.emoji}</div>
                <h4 style={{ margin: '0 0 var(--space-1)', color: 'var(--text-primary)' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
