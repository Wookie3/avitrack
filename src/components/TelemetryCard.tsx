import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

interface TelemetryCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  className?: string
  glowColor?: 'cyan' | 'lime' | 'amber'
}

export function TelemetryCard({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  className,
  glowColor = 'cyan'
}: TelemetryCardProps) {
  const glowClasses = {
    cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
    lime: 'border-lime-500/30 hover:border-lime-500/50',
    amber: 'border-amber-500/30 hover:border-amber-500/50',
  }
  
  const textClasses = {
    cyan: 'text-cyan-400',
    lime: 'text-lime-400',
    amber: 'text-amber-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-card p-4 transition-all',
        glowClasses[glowColor],
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('w-4 h-4', textClasses[glowColor])} />
        <span className="telemetry-label">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('telemetry-value', textClasses[glowColor])}>
          {value}
        </span>
        {unit && <span className="text-slate-500 text-sm">{unit}</span>}
      </div>
    </motion.div>
  )
}
