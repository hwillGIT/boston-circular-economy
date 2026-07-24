import type { MapProvider } from './MapProviderInterface'
import { LeafletProvider } from './LeafletProvider'
import { GoogleMapsProvider } from './GoogleMapsProvider'

const PROVIDERS: Record<string, () => MapProvider> = {
  leaflet: () => new LeafletProvider(),
  google: () => new GoogleMapsProvider(),
  // mapbox: () => new MapboxProvider(), // Future
}

export function createProvider(name = 'leaflet', _options?: Record<string, unknown>): MapProvider {
  let providerName = name.toLowerCase()
  if (providerName === 'google' && !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    providerName = 'leaflet'
  }
  
  const factory = PROVIDERS[providerName]
  if (!factory) {
    console.warn(`Map provider '${name}' not found. Falling back to 'leaflet'.`)
    return PROVIDERS['leaflet']()
  }
  
  const provider = factory()
  // Basic validation that provider implements interface
  const requiredMethods = [
    'init', 'destroy', 'addMarkers', 'clearMarkers', 
    'flyTo', 'fitBounds', 'showRoute', 'clearRoute', 
    'highlightMarker', 'clearHighlight', 'onMarkerClick'
  ]
  
  for (const method of requiredMethods) {
    if (typeof (provider as any)[method] !== 'function') {
      throw new Error(`Provider '${name}' is missing required method '${method}'`)
    }
  }

  return provider
}

export function getAvailableProviders(): string[] {
  return Object.keys(PROVIDERS)
}
