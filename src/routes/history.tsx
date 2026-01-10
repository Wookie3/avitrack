import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { History, Plane, Clock, MapPin, Calendar } from 'lucide-react'
import type { Flight } from '~/lib/api'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

// Mock historical data - in production this would come from API/database
const mockHistoricalFlights = [
  {
    id: '1',
    flight: 'AA100',
    airline: 'American Airlines',
    from: 'JFK',
    to: 'LHR',
    date: '2026-01-02',
    departureTime: '19:30',
    arrivalTime: '07:45',
    status: 'On Time',
    duration: '7h 15m',
  },
  {
    id: '2',
    flight: 'UA456',
    airline: 'United Airlines',
    from: 'LAX',
    to: 'NRT',
    date: '2026-01-01',
    departureTime: '11:20',
    arrivalTime: '15:45',
    status: 'Delayed +45m',
    duration: '11h 25m',
  },
  {
    id: '3',
    flight: 'DL789',
    airline: 'Delta Air Lines',
    from: 'ATL',
    to: 'CDG',
    date: '2025-12-31',
    departureTime: '22:00',
    arrivalTime: '12:30',
    status: 'On Time',
    duration: '8h 30m',
  },
  {
    id: '4',
    flight: 'BA178',
    airline: 'British Airways',
    from: 'LHR',
    to: 'JFK',
    date: '2025-12-30',
    departureTime: '09:15',
    arrivalTime: '12:30',
    status: 'Early -10m',
    duration: '8h 15m',
  },
]

function HistoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <History className="w-8 h-8 text-cyan-400" />
          Flight History
        </h1>
        <p className="text-slate-400 mt-2">
          Review past flight records and performance data
        </p>
      </motion.div>
      
      {/* ATC Progress Strips */}
      <div className="space-y-3">
        {mockHistoricalFlights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="atc-strip glass-card hover:border-cyan-500/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Flight Info */}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold text-lg text-cyan-400 font-mono">
                    {flight.flight}
                  </div>
                  <div className="text-xs text-slate-400">{flight.airline}</div>
                </div>
              </div>
              
              {/* Route */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-100 font-mono">{flight.from}</div>
                  <div className="text-xs text-slate-500">{flight.departureTime}</div>
                </div>
                <div className="flex items-center text-slate-600">
                  <div className="w-8 h-px bg-slate-600" />
                  <Plane className="w-4 h-4 -rotate-90 mx-1" />
                  <div className="w-8 h-px bg-slate-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-100 font-mono">{flight.to}</div>
                  <div className="text-xs text-slate-500">{flight.arrivalTime}</div>
                </div>
              </div>
              
              {/* Date & Duration */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-mono">{flight.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">{flight.duration}</span>
                </div>
              </div>
              
              {/* Status */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                flight.status.includes('On Time') ? 'bg-lime-500/20 text-lime-400' :
                flight.status.includes('Early') ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {flight.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4 border-slate-700/30"
      >
        <p className="text-slate-400 text-sm text-center">
          <span className="text-cyan-400">Note:</span> Historical flight data requires an Aviationstack premium subscription.
          Contact support for access to comprehensive flight history and analytics.
        </p>
      </motion.div>
    </div>
  )
}
