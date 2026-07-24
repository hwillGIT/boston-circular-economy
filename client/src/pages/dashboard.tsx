import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getActivities, computeImpactStats } from '../lib/api'
import type { Activity, ImpactStats } from '../lib/types'
import KPICard from '../components/KPICard'
import ActivityTable from '../components/ActivityTable'
import CTAButton from '../components/CTAButton'
import EcoStreak from '../components/EcoStreak'
import BadgeGrid from '../components/BadgeGrid'
import Leaderboard from '../components/Leaderboard'
import GratitudeFeed from '../components/GratitudeFeed'
import './Dashboard.css'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<ImpactStats>({
    items_diverted: 0,
    co2_prevented: 0,
    money_saved: 0,
    credits_earned: 0,
  })
  const [_loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all')

  useEffect(() => {
    getActivities()
      .then(data => {
        setActivities(data)
        setStats(computeImpactStats(data))
        setLoading(false)
      })
      .catch(() => {
        // API may not have activities yet — show empty state
        setLoading(false)
      })
  }, [])

  const handleExport = (format: 'csv' | 'pdf') => {
    // Future: generate real exports
    alert(`Export as ${format.toUpperCase()} coming soon!`)
  }

  const repairs = activities.filter(a => a.action === 'repair').length

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* ── Header ── */}
        <header className="dashboard-header">
          <div className="dashboard-header-text">
            <h1 className="dashboard-title">Your Impact Dashboard</h1>
            <p className="dashboard-subtitle">
              Track your contributions to Boston's circular economy
            </p>
          </div>
          <EcoStreak />
        </header>

        {/* ── KPI Cards ── */}
        <div className="kpi-grid">
          <KPICard
            label="Items Diverted"
            value={stats.items_diverted}
            icon="♻️"
            accentColor="var(--color-green)"
            unit="items"
            tooltip="Every item repaired, donated, or swapped is one less item in a landfill. The average American throws away 81 lbs of clothing alone per year. This counter tracks items you've personally kept in circulation — supporting UN SDG 12: Responsible Consumption and Production."
          />
          <KPICard
            label="CO₂ Prevented"
            value={stats.co2_prevented}
            icon="🌍"
            accentColor="var(--color-teal)"
            unit="kg"
            tooltip="Manufacturing new goods is one of the largest sources of greenhouse gas emissions. By repairing or reusing, you avoid the CO₂ from raw material extraction, factory production, and shipping. 1 kg of CO₂ saved is equivalent to driving 2.5 fewer miles. This directly supports UN SDG 13: Climate Action."
          />
          <KPICard
            label="Money Saved"
            value={stats.money_saved}
            icon="💰"
            accentColor="var(--color-cta)"
            unit="$"
            tooltip="Repairing costs a fraction of replacing. The average US household spends $1,800/year on items that could be repaired, borrowed, or found secondhand. This tracks your estimated savings from choosing circular economy options over buying new."
          />
          <KPICard
            label="Credits Earned"
            value={stats.credits_earned}
            icon="⭐"
            accentColor="var(--color-purple)"
            unit="credits"
            tooltip="Circular Economy Credits reward every sustainable action you take — logging a repair, donating items, attending events. Credits unlock badges, boost your neighborhood's leaderboard ranking, and will soon be redeemable at participating Boston businesses."
          />
        </div>

        {/* ── SDG: tiny inline bar, tap for detail ── */}
        <div className="sdg-bar">
          <span className="sdg-bar-label">Contributing to UN Goals</span>
          <div className="sdg-bar-badges">
            <span className="sdg-dot" style={{ backgroundColor: 'var(--sdg-11)' }} title="SDG 11: Sustainable Cities — Your local repairs strengthen community infrastructure">11</span>
            <span className="sdg-dot" style={{ backgroundColor: 'var(--sdg-12)' }} title="SDG 12: Responsible Consumption — Every item diverted reduces demand for new manufacturing">12</span>
            <span className="sdg-dot" style={{ backgroundColor: 'var(--sdg-13)' }} title="SDG 13: Climate Action — Repairing prevents CO₂ from manufacturing and shipping">13</span>
          </div>
        </div>

        <div className="dashboard-main-layout">
          <div className="dashboard-left-col">
            <BadgeGrid items={stats.items_diverted} co2={stats.co2_prevented} repairs={repairs} />
            
            {/* ── Activity Log ── */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">Activity Log</h2>
                <div className="report-controls">
                  <select
                    className="report-select"
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="today">Today</option>
                  </select>
                  <button
                    className="export-btn"
                    onClick={() => handleExport('csv')}
                  >
                    📥 Export CSV
                  </button>
                  <button
                    className="export-btn"
                    onClick={() => handleExport('pdf')}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>

              {activities.length > 0 ? (
                <div className="activity-table-container">
                  <ActivityTable activities={activities} />
                </div>
              ) : (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">📊</div>
                  <h3 className="dashboard-empty-title">
                    No activities logged yet
                  </h3>
                  <p className="dashboard-empty-sub">
                    Start by finding a repair option or donation center near you.
                    Every action you log contributes to Boston's circular economy.
                  </p>
                  <CTAButton
                    label="Explore the Map"
                    onClick={() => navigate({ to: '/explore' })}
                    variant="primary"
                  />
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column: clickable/interactive first ── */}
          <div className="dashboard-right-col">
            <Leaderboard />
            <GratitudeFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
