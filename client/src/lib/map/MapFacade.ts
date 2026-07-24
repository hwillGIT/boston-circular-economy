import type { MapProvider, MapOptions } from './MapProviderInterface'
import { createProvider, getAvailableProviders } from './MapProviderFactory'

// Singleton module state
let currentProviderName = 'leaflet'
let providerInstance: MapProvider | null = null

function ensureProvider(): MapProvider {
  if (!providerInstance) {
    throw new Error('MapFacade not initialized. Call init() first.')
  }
  return providerInstance
}

export const MapFacade = {
  setProvider(name: string, options?: Record<string, unknown>): void {
    if (name === currentProviderName && providerInstance) return
    
    if (providerInstance) {
      providerInstance.destroy()
    }
    
    currentProviderName = name
    providerInstance = createProvider(name, options)
  },

  init(containerId: string, options?: MapOptions): void {
    if (!providerInstance) {
      providerInstance = createProvider(currentProviderName)
    }
    providerInstance.init(containerId, options)
  },

  destroy(): void {
    if (providerInstance) {
      providerInstance.destroy()
      providerInstance = null
    }
  },

  addMarkers(locations: Array<{id: number, lat: number, lng: number, type: string, name: string}>, colorMap: Record<string, string>): void {
    try {
      ensureProvider().addMarkers(locations, colorMap)
    } catch (e) {
      console.warn(e)
    }
  },

  clearMarkers(): void {
    try {
      ensureProvider().clearMarkers()
    } catch (e) {
      console.warn(e)
    }
  },

  flyTo(lat: number, lng: number, zoom?: number): void {
    try {
      ensureProvider().flyTo(lat, lng, zoom)
    } catch (e) {
      console.warn(e)
    }
  },

  fitBounds(locations: Array<{lat: number, lng: number}>, padding?: number): void {
    try {
      ensureProvider().fitBounds(locations, padding)
    } catch (e) {
      console.warn(e)
    }
  },

  async showRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<void> {
    try {
      await ensureProvider().showRoute(fromLat, fromLng, toLat, toLng)
    } catch (e) {
      console.warn(e)
    }
  },

  clearRoute(): void {
    try {
      ensureProvider().clearRoute()
    } catch (e) {
      console.warn(e)
    }
  },

  highlightMarker(locationId: number): void {
    try {
      ensureProvider().highlightMarker(locationId)
    } catch (e) {
      console.warn(e)
    }
  },

  clearHighlight(): void {
    try {
      ensureProvider().clearHighlight()
    } catch (e) {
      console.warn(e)
    }
  },

  onMarkerClick(callback: (locationId: number) => void): void {
    try {
      ensureProvider().onMarkerClick(callback)
    } catch (e) {
      console.warn(e)
    }
  },

  onMapMove(callback: (bounds: {north: number, south: number, east: number, west: number}) => void): void {
    try {
      ensureProvider().onMapMove(callback)
    } catch (e) {
      console.warn(e)
    }
  },

  getProviderInfo(): { current: string, available: string[] } {
    return {
      current: currentProviderName,
      available: getAvailableProviders()
    }
  }
}
