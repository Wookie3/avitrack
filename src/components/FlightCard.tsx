import { motion } from 'framer-motion'
import { Plane, Clock, MapPin, Gauge, Navigation, ArrowRight } from 'lucide-react'
import type { Flight } from '~/lib/api'
import { formatTime, formatDelay, getFlightProgress } from '~/lib/api'
import { cn } from '~/lib/utils'

interface FlightCardProps {
  flight: Flight
  onClick?: () => void
}

export function FlightCard({ flight, onClick }: FlightCardProps) {
  const progress = getFlightProgress(flight.departure, flight.arrival)
  const isLive = flight.flight_status === 'active' && flight.live
  
  const statusColors = {
    scheduled: 'text-slate-400',
    active: 'text-lime-400',
    landed: 'text-cyan-400',
    cancelled: 'text-red-500',
    incident: 'text-red-500',
    diverted: 'text-amber-400',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-5 cursor-pointer transition-all hover:border-cyan-500/50"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Plane className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-lg text-slate-100 tracking-wide">
              {flight.flight.iata}
            </div>
            <div className="text-xs text-slate-400">{flight.airline.name}</div>
          </div>
        </div>
        <div className={cn('text-sm font-medium uppercase tracking-wider', statusColors[flight.flight_status])}>
          {isLive && <span className="inline-block w-2 h-2 rounded-full bg-lime-400 mr-2 animate-pulse" />}
          {flight.flight_status}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="telemetry-value">{flight.departure.iata}</div>
          <div className="telemetry-label">{formatTime(flight.departure.scheduled)}</div>
          {flight.departure.delay && (
            <div className="text-xs text-amber-400">{formatDelay(flight.departure.delay)}</div>
          )}
        </div>
        
        <div className="flex-1 mx-4">
          <div className="relative h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-cyan-500 to-lime-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {isLive && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3"
                style={{ left: `${progress}%` }}
                initial={{ x: '-50%' }}
              >
                <Plane className="w-3 h-3 text-lime-400 -rotate-90" />
              </motion.div>
            )}
          </div>
          <div className="text-center text-xs text-slate-500 mt-1">{progress}%</div>
        </div>
        
        <div className="text-center">
          <div className="telemetry-value">{flight.arrival.iata}</div>
          <div className="telemetry-label">{formatTime(flight.arrival.scheduled)}</div>
          {flight.arrival.delay && (
            <div className="text-xs text-amber-400">{formatDelay(flight.arrival.delay)}</div>
          )}
        </div>
      </div>
      
      {isLive && flight.live && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Gauge className="w-3 h-3" />
              <span className="telemetry-label">ALT</span>
            </div>
            <div className="text-cyan-400 font-mono">{Math.round(flight.live.altitude)} ft</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Navigation className="w-3 h-3" />
              <span className="telemetry-label">SPD</span>
            </div>
            <div className="text-cyan-400 font-mono">{Math.round(flight.live.speed_horizontal)} kts</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <ArrowRight className="w-3 h-3" style={{ transform: `rotate(${flight.live.direction - 90}deg)` }} />
              <span className="telemetry-label">HDG</span>
            </div>
            <div className="text-cyan-400 font-mono">{Math.round(flight.live.direction)}°</div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
