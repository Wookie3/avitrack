import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plane, Activity, Clock, Globe, Radar } from 'lucide-react'
import { TelemetryCard } from '~/components/TelemetryCard'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
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
          label="API Quota"
          value="100/mo"
          glowColor="lime"
        />
        <TelemetryCard
          icon={Clock}
          label="Status"
          value="Ready"
          glowColor="cyan"
        />
        <TelemetryCard
          icon={Globe}
          label="Coverage"
          value="Worldwide"
          glowColor="cyan"
        />
        <TelemetryCard
          icon={Radar}
          label="Search"
          value="Flight #"
          glowColor="amber"
        />
      </div>

      {/* CTA to Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-12 text-center"
      >
        <Plane className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Search for Flights</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Enter a flight number, airport code, or airline to get real-time flight information.
        </p>
        <Button
          onClick={() => window.location.href = '/search'}
          size="lg"
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          Start Searching
        </Button>
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-sm text-slate-500 mb-2">Example searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">AA100</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">UA123</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">JFK</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm font-mono">LAX</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
