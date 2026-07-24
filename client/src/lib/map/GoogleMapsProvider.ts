import type { MapProvider, MapOptions } from './MapProviderInterface'

export class GoogleMapsProvider implements MapProvider {
  private map: google.maps.Map | null = null
  private markers: Map<number, google.maps.Marker> = new Map()
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private markerClickHandler?: (id: number) => void
  private mapMoveHandler?: (bounds: {north: number, south: number, east: number, west: number}) => void
  private highlightedMarkerId: number | null = null
  private googleMapsLoaded: Promise<void> | null = null
  private fallbackProvider: MapProvider | null = null

  private loadGoogleMapsScript(): Promise<void> {
    if (this.googleMapsLoaded) return this.googleMapsLoaded

    this.googleMapsLoaded = new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve()
        return
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (e) => reject(e)
      document.head.appendChild(script)
    })

    return this.googleMapsLoaded
  }

  async init(containerId: string, options?: MapOptions): Promise<void> {
    try {
      await this.loadGoogleMapsScript()
    } catch (e) {
      console.warn('Failed to load Google Maps, falling back to Leaflet', e)
      const { LeafletProvider } = await import('./LeafletProvider')
      this.fallbackProvider = new LeafletProvider()
      this.fallbackProvider.init(containerId, options)
      return
    }

    if (this.map) return

    const container = document.getElementById(containerId)
    if (!container) return

    const center = options?.center || [42.3601, -71.0589]
    const zoom = options?.zoom || 13

    this.map = new google.maps.Map(container, {
      center: { lat: center[0], lng: center[1] },
      zoom: zoom,
      minZoom: options?.minZoom,
      maxZoom: options?.maxZoom,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      styles: [
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
        { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
        { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 21 }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dedede" }, { lightness: 21 }] },
        { elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
        { elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f2f2f2" }, { lightness: 19 }] },
        { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#fefefe" }, { lightness: 20 }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }] }
      ]
    })

    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeOpacity: 0.7,
        strokeWeight: 4
      }
    })

    this.map.addListener('idle', () => {
      if (this.mapMoveHandler && this.map) {
        const bounds = this.map.getBounds()
        if (bounds) {
          const ne = bounds.getNorthEast()
          const sw = bounds.getSouthWest()
          this.mapMoveHandler({
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng()
          })
        }
      }
    })
  }

  destroy(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.destroy()
      this.fallbackProvider = null
    }

    this.clearMarkers()
    this.clearRoute()
    
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map)
      this.map = null
    }
  }

  addMarkers(locations: Array<{id: number, lat: number, lng: number, type: string, name: string}>, colorMap: Record<string, string>): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.addMarkers(locations, colorMap)
      return
    }

    if (!this.map) return

    this.clearMarkers()

    locations.forEach(loc => {
      const color = colorMap[loc.type] || colorMap.default || '#64748B'
      
      const svgMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 8,
      }
      
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: this.map,
        icon: svgMarker,
        title: loc.name
      })

      marker.addListener('click', () => {
        if (this.markerClickHandler) {
          this.markerClickHandler(loc.id)
        }
      })

      this.markers.set(loc.id, marker)
    })
  }

  clearMarkers(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.clearMarkers()
      return
    }

    this.markers.forEach(marker => {
      marker.setMap(null)
    })
    this.markers.clear()
    this.clearHighlight()
  }

  flyTo(lat: number, lng: number, zoom = 15): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.flyTo(lat, lng, zoom)
      return
    }

    if (this.map) {
      this.map.panTo({ lat, lng })
      this.map.setZoom(zoom)
    }
  }

  fitBounds(locations: Array<{lat: number, lng: number}>, padding = 50): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.fitBounds(locations, padding)
      return
    }

    if (!this.map || locations.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    locations.forEach(loc => {
      bounds.extend({ lat: loc.lat, lng: loc.lng })
    })
    this.map.fitBounds(bounds, padding)
  }

  async showRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<void> {
    if (this.fallbackProvider) {
      return this.fallbackProvider.showRoute(fromLat, fromLng, toLat, toLng)
    }

    if (!this.map || !this.directionsService || !this.directionsRenderer) return

    try {
      const result = await this.directionsService.route({
        origin: { lat: fromLat, lng: fromLng },
        destination: { lat: toLat, lng: toLng },
        travelMode: google.maps.TravelMode.WALKING
      })
      this.directionsRenderer.setDirections(result)
    } catch (e) {
      console.error('Directions request failed due to ' + e)
    }
  }

  clearRoute(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.clearRoute()
      return
    }

    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] })
    }
  }

  highlightMarker(locationId: number): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.highlightMarker(locationId)
      return
    }

    if (this.highlightedMarkerId === locationId) return
    this.clearHighlight()

    const marker = this.markers.get(locationId)
    if (marker) {
      this.highlightedMarkerId = locationId
      const icon = marker.getIcon() as google.maps.Symbol
      if (icon) {
        marker.setIcon({
          ...icon,
          scale: 14, // Scale up for highlight
        })
      }
    }
  }

  clearHighlight(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.clearHighlight()
      return
    }

    if (this.highlightedMarkerId) {
      const marker = this.markers.get(this.highlightedMarkerId)
      if (marker) {
        const icon = marker.getIcon() as google.maps.Symbol
        if (icon) {
          marker.setIcon({
            ...icon,
            scale: 8, // Back to normal
          })
        }
      }
      this.highlightedMarkerId = null
    }
  }

  onMarkerClick(callback: (locationId: number) => void): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.onMarkerClick(callback)
    }
    this.markerClickHandler = callback
  }

  onMapMove(callback: (bounds: {north: number, south: number, east: number, west: number}) => void): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.onMapMove(callback)
    }
    this.mapMoveHandler = callback
  }

  getProviderName(): string {
    if (this.fallbackProvider) {
      return this.fallbackProvider.getProviderName()
    }
    return 'google'
  }
}
