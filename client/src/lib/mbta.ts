/* ── MBTA Station Coordinates ── */
/* Used to tag locations with their nearest transit line */

interface MBTAStation {
  name: string
  lat: number
  lng: number
  line: string
}

/** Key stations per line — enough to provide reasonable proximity coverage */
const MBTA_STATIONS: MBTAStation[] = [
  // Orange Line
  { name: 'Oak Grove', lat: 42.4368, lng: -71.0710, line: 'orange' },
  { name: 'Malden Center', lat: 42.4267, lng: -71.0740, line: 'orange' },
  { name: 'Wellington', lat: 42.4024, lng: -71.0770, line: 'orange' },
  { name: 'Assembly', lat: 42.3926, lng: -71.0773, line: 'orange' },
  { name: 'Sullivan Square', lat: 42.3840, lng: -71.0770, line: 'orange' },
  { name: 'Community College', lat: 42.3736, lng: -71.0695, line: 'orange' },
  { name: 'North Station', lat: 42.3654, lng: -71.0614, line: 'orange' },
  { name: 'Haymarket', lat: 42.3632, lng: -71.0584, line: 'orange' },
  { name: 'State', lat: 42.3587, lng: -71.0576, line: 'orange' },
  { name: 'Downtown Crossing', lat: 42.3555, lng: -71.0604, line: 'orange' },
  { name: 'Chinatown', lat: 42.3524, lng: -71.0624, line: 'orange' },
  { name: 'Tufts Medical Center', lat: 42.3497, lng: -71.0639, line: 'orange' },
  { name: 'Back Bay', lat: 42.3474, lng: -71.0753, line: 'orange' },
  { name: 'Massachusetts Ave', lat: 42.3415, lng: -71.0833, line: 'orange' },
  { name: 'Ruggles', lat: 42.3365, lng: -71.0893, line: 'orange' },
  { name: 'Roxbury Crossing', lat: 42.3313, lng: -71.0953, line: 'orange' },
  { name: 'Jackson Square', lat: 42.3232, lng: -71.0997, line: 'orange' },
  { name: 'Stony Brook', lat: 42.3170, lng: -71.1042, line: 'orange' },
  { name: 'Green Street', lat: 42.3105, lng: -71.1078, line: 'orange' },
  { name: 'Forest Hills', lat: 42.3005, lng: -71.1139, line: 'orange' },

  // Red Line
  { name: 'Alewife', lat: 42.3954, lng: -71.1426, line: 'red' },
  { name: 'Davis', lat: 42.3967, lng: -71.1227, line: 'red' },
  { name: 'Porter', lat: 42.3884, lng: -71.1191, line: 'red' },
  { name: 'Harvard', lat: 42.3734, lng: -71.1189, line: 'red' },
  { name: 'Central', lat: 42.3653, lng: -71.1038, line: 'red' },
  { name: 'Kendall/MIT', lat: 42.3625, lng: -71.0862, line: 'red' },
  { name: 'Charles/MGH', lat: 42.3613, lng: -71.0709, line: 'red' },
  { name: 'Park Street', lat: 42.3564, lng: -71.0624, line: 'red' },
  { name: 'South Station', lat: 42.3523, lng: -71.0553, line: 'red' },
  { name: 'Broadway', lat: 42.3426, lng: -71.0569, line: 'red' },
  { name: 'Andrew', lat: 42.3302, lng: -71.0575, line: 'red' },
  { name: 'JFK/UMass', lat: 42.3209, lng: -71.0525, line: 'red' },
  { name: 'Savin Hill', lat: 42.3113, lng: -71.0535, line: 'red' },
  { name: 'Fields Corner', lat: 42.3002, lng: -71.0617, line: 'red' },
  { name: 'Shawmut', lat: 42.2932, lng: -71.0658, line: 'red' },
  { name: 'Ashmont', lat: 42.2840, lng: -71.0641, line: 'red' },
  { name: 'Quincy Center', lat: 42.2518, lng: -71.0054, line: 'red' },
  { name: 'Braintree', lat: 42.2078, lng: -71.0011, line: 'red' },

  // Green Line (combined branches)
  { name: 'Lechmere', lat: 42.3707, lng: -71.0769, line: 'green' },
  { name: 'Science Park', lat: 42.3668, lng: -71.0677, line: 'green' },
  { name: 'North Station', lat: 42.3654, lng: -71.0614, line: 'green' },
  { name: 'Government Center', lat: 42.3594, lng: -71.0590, line: 'green' },
  { name: 'Park Street', lat: 42.3564, lng: -71.0624, line: 'green' },
  { name: 'Boylston', lat: 42.3528, lng: -71.0649, line: 'green' },
  { name: 'Arlington', lat: 42.3519, lng: -71.0709, line: 'green' },
  { name: 'Copley', lat: 42.3498, lng: -71.0774, line: 'green' },
  { name: 'Hynes Convention Center', lat: 42.3472, lng: -71.0870, line: 'green' },
  { name: 'Kenmore', lat: 42.3488, lng: -71.0954, line: 'green' },
  { name: 'Fenway', lat: 42.3452, lng: -71.1003, line: 'green' },
  { name: 'Brookline Village', lat: 42.3327, lng: -71.1164, line: 'green' },
  { name: 'Coolidge Corner', lat: 42.3420, lng: -71.1232, line: 'green' },
  { name: 'Boston College', lat: 42.3398, lng: -71.1667, line: 'green' },
  { name: 'Cleveland Circle', lat: 42.3363, lng: -71.1493, line: 'green' },
  { name: 'Riverside', lat: 42.3372, lng: -71.2525, line: 'green' },
  { name: 'Union Square', lat: 42.3793, lng: -71.0952, line: 'green' },
  { name: 'East Somerville', lat: 42.3800, lng: -71.0870, line: 'green' },
  { name: 'Medford/Tufts', lat: 42.4076, lng: -71.1165, line: 'green' },

  // Blue Line
  { name: 'Wonderland', lat: 42.4134, lng: -70.9917, line: 'blue' },
  { name: 'Revere Beach', lat: 42.4077, lng: -70.9925, line: 'blue' },
  { name: 'Beachmont', lat: 42.3974, lng: -70.9923, line: 'blue' },
  { name: 'Suffolk Downs', lat: 42.3903, lng: -70.9970, line: 'blue' },
  { name: 'Orient Heights', lat: 42.3868, lng: -71.0047, line: 'blue' },
  { name: 'Wood Island', lat: 42.3797, lng: -71.0230, line: 'blue' },
  { name: 'Airport', lat: 42.3743, lng: -71.0303, line: 'blue' },
  { name: 'Maverick', lat: 42.3691, lng: -71.0397, line: 'blue' },
  { name: 'Aquarium', lat: 42.3597, lng: -71.0518, line: 'blue' },
  { name: 'State', lat: 42.3587, lng: -71.0576, line: 'blue' },
  { name: 'Government Center', lat: 42.3594, lng: -71.0590, line: 'blue' },
  { name: 'Bowdoin', lat: 42.3614, lng: -71.0620, line: 'blue' },

  // Mattapan Trolley
  { name: 'Ashmont', lat: 42.2840, lng: -71.0641, line: 'mattapan' },
  { name: 'Cedar Grove', lat: 42.2795, lng: -71.0607, line: 'mattapan' },
  { name: 'Butler', lat: 42.2724, lng: -71.0627, line: 'mattapan' },
  { name: 'Milton', lat: 42.2703, lng: -71.0672, line: 'mattapan' },
  { name: 'Central Avenue', lat: 42.2677, lng: -71.0731, line: 'mattapan' },
  { name: 'Valley Road', lat: 42.2684, lng: -71.0816, line: 'mattapan' },
  { name: 'Capen Street', lat: 42.2678, lng: -71.0873, line: 'mattapan' },
  { name: 'Mattapan', lat: 42.2676, lng: -71.0938, line: 'mattapan' },
]

/** Maximum walking distance to consider a location "near" a station (meters) */
const PROXIMITY_RADIUS_M = 800

/** Haversine distance in meters */
function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const p1 = lat1 * Math.PI / 180
  const p2 = lat2 * Math.PI / 180
  const dp = (lat2 - lat1) * Math.PI / 180
  const dl = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(dp / 2) ** 2 +
            Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface NearestStation {
  name: string
  line: string
  distanceM: number
  walkMinutes: number
}

/** Find the nearest MBTA station to a location */
export function findNearestStation(lat: number, lng: number): NearestStation | null {
  let best: NearestStation | null = null

  for (const station of MBTA_STATIONS) {
    const d = haversineM(lat, lng, station.lat, station.lng)
    if (d <= PROXIMITY_RADIUS_M && (!best || d < best.distanceM)) {
      best = {
        name: station.name,
        line: station.line,
        distanceM: Math.round(d),
        walkMinutes: Math.round(d / 80), // ~80m/min walking pace
      }
    }
  }

  return best
}

/** Get all lines a location is near (within radius) */
export function getNearbyLines(lat: number, lng: number): string[] {
  const lines = new Set<string>()
  for (const station of MBTA_STATIONS) {
    if (haversineM(lat, lng, station.lat, station.lng) <= PROXIMITY_RADIUS_M) {
      lines.add(station.line)
    }
  }
  return [...lines]
}
