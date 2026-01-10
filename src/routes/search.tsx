import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Plane, ArrowLeft, Filter } from 'lucide-react'
import { FlightCard } from '~/components/FlightCard'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { searchFlights } from '~/server/flights'
import type { Flight } from '~/lib/api'
import * as React from 'react'

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || '',
  }),
  component: SearchPage,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    if (!q) return { flights: [], query: '' }
    try {
      const data = await searchFlights({ data: { query: q, limit: 20 } })
      return { flights: data, query: q }
    } catch {
      return { flights: [], query: q, error: true }
    }
  },
})

function SearchPage() {
  const { flights: initialFlights, query: initialQuery, error } = Route.useLoaderData()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = React.useState(initialQuery)
  
  const { data: flights, isLoading, isFetching } = useQuery({
    queryKey: ['search', initialQuery],
    queryFn: async () => {
      if (!initialQuery) return []
      const result = await searchFlights({ data: { query: initialQuery, limit: 20 } })
      return result
    },
    initialData: initialFlights,
    enabled: !!initialQuery,
  })
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate({
        to: '/search',
        search: { q: searchInput.trim().toUpperCase() }
      })
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <form onSubmit={handleSearch} className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Flight number, airport code, or airline..."
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isFetching}>
            {isFetching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      
      {/* Results Header */}
      {initialQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Results for <span className="text-cyan-400">"{initialQuery}"</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {flights.length} flight{flights.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="glass-card p-6 text-center border-amber-500/50">
          <p className="text-amber-400 mb-2">Search failed</p>
          <p className="text-slate-400 text-sm">Please try a different search term</p>
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
      
      {/* Results Grid */}
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
      {!isLoading && flights.length === 0 && initialQuery && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Plane className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No flights found</h3>
          <p className="text-slate-500 mb-4">
            Try searching with a different flight number or airport code
          </p>
          <div className="text-sm text-slate-400">
            <p>Examples:</p>
            <p className="text-cyan-400 font-mono mt-1">AA100, UA123, JFK, LAX</p>
          </div>
        </motion.div>
      )}
      
      {/* Initial State */}
      {!initialQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Search for flights</h3>
          <p className="text-slate-500">
            Enter a flight number, airport code, or airline name to get started
          </p>
        </motion.div>
      )}
    </div>
  )
}
