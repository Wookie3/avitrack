const API_BASE = 'https://api.aviationstack.com/v1'

export interface Flight {
  flight_date: string
  flight_status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted'
  departure: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string | null
    gate: string | null
    delay: number | null
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway: string | null
    actual_runway: string | null
  }
  arrival: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string | null
    gate: string | null
    baggage: string | null
    delay: number | null
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway: string | null
    actual_runway: string | null
  }
  airline: {
    name: string
    iata: string
    icao: string
  }
  flight: {
    number: string
    iata: string
    icao: string
    codeshared: null | {
      airline_name: string
      airline_iata: string
      flight_number: string
      flight_iata: string
    }
  }
  aircraft: {
    registration: string
    iata: string
    icao: string
    icao24: string
  } | null
  live: {
    updated: string
    latitude: number
    longitude: number
    altitude: number
    direction: number
    speed_horizontal: number
    speed_vertical: number
    is_ground: boolean
  } | null
}

export interface FlightsResponse {
  pagination: {
    limit: number
    offset: number
    count: number
    total: number
  }
  data: Flight[]
}

export interface Airport {
  airport_name: string
  iata_code: string
  icao_code: string
  latitude: string
  longitude: string
  geoname_id: string
  timezone: string
  gmt: string
  phone_number: string | null
  country_name: string
  country_iso2: string
  city_iata_code: string
}

export interface AirportsResponse {
  pagination: {
    limit: number
    offset: number
    count: number
    total: number
  }
  data: Airport[]
}

export async function fetchFlights(params: {
  access_key: string
  flight_iata?: string
  dep_iata?: string
  arr_iata?: string
  airline_iata?: string
  flight_status?: string
  limit?: number
}): Promise<FlightsResponse> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })
  
  const response = await fetch(`${API_BASE}/flights?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export async function fetchAirports(params: {
  access_key: string
  search?: string
  limit?: number
}): Promise<AirportsResponse> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })
  
  const response = await fetch(`${API_BASE}/airports?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export function getFlightProgress(departure: Flight['departure'], arrival: Flight['arrival']): number {
  const now = new Date().getTime()
  const depTime = new Date(departure.actual || departure.scheduled).getTime()
  const arrTime = new Date(arrival.estimated || arrival.scheduled).getTime()
  
  if (now <= depTime) return 0
  if (now >= arrTime) return 100
  
  return Math.round(((now - depTime) / (arrTime - depTime)) * 100)
}

export function formatTime(dateString: string | null): string {
  if (!dateString) return '--:--'
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function formatDelay(minutes: number | null): string {
  if (!minutes || minutes <= 0) return ''
  if (minutes < 60) return `+${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `+${hours}h${mins > 0 ? ` ${mins}m` : ''}`
}
