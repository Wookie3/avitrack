import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plane, Activity, Clock, Globe, Radar, RefreshCw } from 'lucide-react'
import { FlightCard } from '~/components/FlightCard'
import { TelemetryCard } from '~/components/TelemetryCard'
import { Button } from '~/components/ui/button'
import { getFlights } from '~/server/flights'
import type { Flight } from '~/lib/api'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    try {
      const data = await getFlights({ data: { limit: 12 } })
      return { flights: data, error: null }
    } catch (error) {
      return { flights: [], error: 'Failed to load flights' }
    }
  },
})

function Home() {
  const { flights: initialFlights, error } = Route.useLoaderData()
  
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['flights', 'live'],
    queryFn: async () => {
      const result = await getFlights({ data: { limit: 12 } })
      return result
    },
    initialData: initialFlights,
    refetchInterval: 60000,
  })
  
  const flights = data || []
  const activeFlights = flights.filter((f: Flight) => f.flight_status === 'active')
  const scheduledFlights = flights.filter((f: Flight) => f.flight_status === 'scheduled')
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-sm text-cyan-400 font-medium">Live Tracking Active</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-slate-100">Real-Time </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
            Flight Intelligence
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Track flights worldwide with live telemetry data. Monitor altitude, speed, heading, and position in real-time.
        </p>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TelemetryCard
          icon={Activity}
          label="Active Flights"
          value={activeFlights.length}
          glowColor="lime"
        />
        <TelemetryCard
          icon={Clock}
          label="Scheduled"
          value={scheduledFlights.length}
          glowColor="cyan"
        />
        <TelemetryCard
          icon={Globe}
          label="Total Tracked"
          value={flights.length}
          glowColor="cyan"
        />
        <TelemetryCard
          icon={Radar}
          label="Last Update"
          value={new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          glowColor="amber"
        />
      </div>
      
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-100">
          <Plane className="w-5 h-5 inline mr-2 text-cyan-400" />
          Flight Board
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="glass-card p-6 text-center border-amber-500/50">
          <p className="text-amber-400 mb-2">Unable to load flight data</p>
          <p className="text-slate-400 text-sm">Please check your API key configuration</p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
              <div className="h-10 bg-slate-800 rounded mb-4" />
              <div className="h-4 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      )}
      
      {/* Flights Grid */}
      {!isLoading && flights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {flights.map((flight: Flight, index: number) => (
            <FlightCard key={`${flight.flight.iata}-${index}`} flight={flight} />
          ))}
        </motion.div>
      )}
      
      {/* Empty State */}
      {!isLoading && flights.length === 0 && !error && (
        <div className="glass-card p-12 text-center">
          <Plane className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No flights found</h3>
          <p className="text-slate-500">Try refreshing or check back later</p>
        </div>
      )}
    </div>
  )
}
