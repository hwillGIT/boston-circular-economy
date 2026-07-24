import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getAllLocations } from '../lib/api'
import './Landing.css'

export const Route = createFileRoute('/')(
  { component: Landing }
)

const CATEGORIES = [
  {
    key: 'repair',
    emoji: '🔧',
    name: 'Repair & Fix',
    desc: 'Broken appliances, electronics, furniture — find free clinics and local pros',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F97316 100%)',
    activities: ['repair_free', 'repair_paid'],
  },
  {
    key: 'clothing',
    emoji: '👕',
    name: 'Clothing & Textiles',
    desc: 'Mending, alterations, clothing swaps — give your wardrobe a second life',
    gradient: 'linear-gradient(135deg, #C4B5FD 0%, #7C3AED 100%)',
    activities: ['alter', 'repair_free'],
  },
  {
    key: 'donate',
    emoji: '🤝',
    name: 'Donate & Share',
    desc: 'Drop-off points, community fridges, tool libraries — share what you don\'t need',
    gradient: 'linear-gradient(135deg, #99F6E4 0%, #0D9488 100%)',
    activities: ['donate'],
  },
  {
    key: 'resell',
    emoji: '♻️',
    name: 'Resell & Swap',
    desc: 'Consignment, thrift stores, swap events — turn old into value',
    gradient: 'linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)',
    activities: ['resell', 'second_hand'],
  },
  {
    key: 'recycle',
    emoji: '🗑️',
    name: 'Recycle Right',
    desc: 'E-waste, textiles, hazardous — know where to recycle responsibly',
    gradient: 'linear-gradient(135deg, #A7F3D0 0%, #059669 100%)',
    activities: ['recycle'],
  },
  {
    key: 'learn',
    emoji: '📚',
    name: 'Learn & Workshops',
    desc: 'DIY skills, repair cafés, sustainability classes — build knowledge',
    gradient: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
    activities: ['workshop'],
  },
]

const HOW_STEPS = [
  {
    icon: '🔍',
    bg: '#EFF6FF',
    title: 'Tell Us What You Need',
    desc: 'Search by item or browse categories — we\'ll find the right option near you',
  },
  {
    icon: '📍',
    bg: '#F0FDF4',
    title: 'Explore Nearby Options',
    desc: 'Compare free clinics, local pros, and community resources on the map',
  },
  {
    icon: '🌱',
    bg: '#FFFBEB',
    title: 'Take Action & Earn Credits',
    desc: 'Log your activity, track your impact, and earn circular economy credits',
  },
  {
    icon: '📊',
    bg: '#FAF5FF',
    title: 'See Your Impact',
    desc: 'Watch your CO₂ savings, landfill diversion, and community contributions grow',
  },
]

function Landing() {
  const navigate = useNavigate()
  const [locationCount, setLocationCount] = useState<number | null>(null)

  useEffect(() => {
    getAllLocations()
      .then(locs => setLocationCount(locs.length))
      .catch(() => setLocationCount(154)) // Fallback
  }, [])

  const handleCategoryClick = (category: typeof CATEGORIES[number]) => {
    navigate({
      to: '/explore',
      search: { activity: category.activities[0] },
    }).catch(() => {
      window.location.hash = `#/explore?activity=${category.activities[0]}`
    })
  }

  return (
    <div className="landing">
      {/* ── Compact Hero ── */}
      <section className="landing-hero landing-hero--compact">
        <div className="hero-content animate-fade-up">
          <p className="hero-tagline">City of Boston • Circular Economy Initiative</p>
          <h1 className="hero-title">
            Don't toss it. <span>Fix it. Share it. Swap it.</span>
          </h1>
          <p className="hero-subtitle">
            {locationCount ?? '150+'} repair shops, donation centers, and community resources across Greater Boston.
          </p>
          <div className="hero-actions">
            <button
              className="explore-cta"
              onClick={() => navigate({ to: '/explore' }).catch(() => {
                window.location.hash = '#/explore'
              })}
            >
              Explore the Map
            </button>
            <div className="hero-stats-inline">
              <span><strong>{locationCount ?? '154'}</strong> locations</span>
              <span><strong>6</strong> categories</span>
              <span><strong>21</strong> neighborhoods</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories — primary content ── */}
      <section className="landing-categories">
        <h2 className="landing-section-title">What do you need help with?</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.key}
              className="category-card"
              style={{
                '--i': i,
                '--card-gradient': cat.gradient,
              } as React.CSSProperties}
              onClick={() => handleCategoryClick(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(cat)
              }}
            >
              <div className="category-emoji">{cat.emoji}</div>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-how">
        <h2 className="landing-section-title">How It Works</h2>
        <p className="landing-section-sub">
          Three steps to keep stuff out of the landfill and money in your pocket.
        </p>
        <div className="how-steps">
          {HOW_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="how-step"
              style={{ '--i': i } as React.CSSProperties}
            >
              <div
                className="how-step-icon"
                style={{ backgroundColor: step.bg }}
              >
                {step.icon}
              </div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Impact Banner ── */}
      <section className="landing-impact">
        <div className="impact-grid">
          <div>
            <div className="impact-item-value">12,450 lbs</div>
            <div className="impact-item-label">Diverted from Landfill</div>
          </div>
          <div>
            <div className="impact-item-value">8,200 kg</div>
            <div className="impact-item-label">CO₂ Prevented</div>
          </div>
          <div>
            <div className="impact-item-value">$67,500</div>
            <div className="impact-item-label">Community Savings</div>
          </div>
          <div>
            <div className="impact-item-value">3,100+</div>
            <div className="impact-item-label">Residents Helped</div>
          </div>
        </div>
      </section>
    </div>
  )
}
