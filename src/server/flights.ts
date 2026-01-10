import { createServerFn } from '@tanstack/react-start'
import type { Flight, FlightsResponse } from '~/lib/api'

const API_BASE = 'https://api.aviationstack.com/v1'
const API_KEY = process.env.AVIATIONSTACK_API_KEY || ''

export const getFlights = createServerFn()
  .handler(async (params: {
    flight_iata?: string
    dep_iata?: string
    arr_iata?: string
    airline_iata?: string
    flight_status?: string
    limit?: number
  }) => {
    const searchParams = new URLSearchParams({
      access_key: API_KEY,
      limit: String(params.limit || 10),
    })

    if (params.flight_iata) searchParams.append('flight_iata', params.flight_iata)
    if (params.dep_iata) searchParams.append('dep_iata', params.dep_iata)
    if (params.arr_iata) searchParams.append('arr_iata', params.arr_iata)
    if (params.airline_iata) searchParams.append('airline_iata', params.airline_iata)
    if (params.flight_status) searchParams.append('flight_status', params.flight_status)

    const response = await fetch(`${API_BASE}/flights?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: FlightsResponse = await response.json()
    return result.data
  })

export const searchFlights = createServerFn()
  .handler(async (params: { query: string; limit?: number }) => {
    const query = params.query.toUpperCase()
    const searchParams = new URLSearchParams({
      access_key: API_KEY,
      limit: String(params.limit || 20),
    })

    // Try to detect if query is flight number or airport code
    if (query.length === 3) {
      // Likely airport code - search departures and arrivals
      searchParams.append('dep_iata', query)
    } else {
      // Likely flight number
      searchParams.append('flight_iata', query)
    }

    const response = await fetch(`${API_BASE}/flights?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: FlightsResponse = await response.json()
    return result.data
  })

export const getAirports = createServerFn()
  .handler(async (params: { search?: string; limit?: number }) => {
    const searchParams = new URLSearchParams({
      access_key: API_KEY,
      limit: String(params.limit || 20),
    })

    if (params.search) searchParams.append('search', params.search)

    const response = await fetch(`${API_BASE}/airports?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: AirportsResponse = await response.json()
    return result.data
  })
