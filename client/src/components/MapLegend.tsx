import { useState } from 'react'
import './MapLegend.css'

interface LegendCategory {
  key: string
  color: string
  label: string
  count?: number
}

interface MapLegendProps {
  categories: LegendCategory[]
}

export default function MapLegend({ categories }: MapLegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (key: string) => {
    const newHidden = new Set(hiddenCategories)
    if (newHidden.has(key)) {
      newHidden.delete(key)
    } else {
      newHidden.add(key)
    }
    setHiddenCategories(newHidden)
    // Note: For full functionality, we'd pass this up to the parent or map facade
    // to actually toggle map layers. For now, we'll just track UI state.
  }

  return (
    <div className={`map-legend ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="map-legend-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h3 className="map-legend-title">Legend</h3>
        <button 
          className="map-legend-toggle"
          aria-label={isCollapsed ? 'Expand legend' : 'Collapse legend'}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="map-legend-content">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`map-legend-item ${hiddenCategories.has(cat.key) ? 'hidden-layer' : ''}`}
              onClick={() => toggleCategory(cat.key)}
            >
              <span 
                className="map-legend-color" 
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              <span className="map-legend-label">{cat.label}</span>
              {cat.count !== undefined && (
                <span className="map-legend-count">{cat.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
