import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plane, Search, History, MapPin } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './ui/command-dialog'

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const recentSearches = [
  { type: 'flight', value: 'AA100', label: 'American Airlines 100' },
  { type: 'flight', value: 'UA123', label: 'United Airlines 123' },
  { type: 'airport', value: 'JFK', label: 'John F. Kennedy International' },
]

const popularAirports = [
  { code: 'JFK', name: 'New York JFK' },
  { code: 'LAX', name: 'Los Angeles' },
  { code: 'LHR', name: 'London Heathrow' },
  { code: 'DXB', name: 'Dubai' },
  { code: 'SIN', name: 'Singapore Changi' },
]

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = React.useState('')
  const navigate = useNavigate()
  
  const handleSearch = (searchQuery: string) => {
    onOpenChange(false)
    setQuery('')
    navigate({
      to: '/search',
      search: { q: searchQuery }
    })
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query.trim().toUpperCase())
    }
  }
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search flight number, airport code, or airline..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        {query.length === 0 ? (
          <>
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => handleSearch(item.value)}
                >
                  {item.type === 'flight' ? (
                    <Plane className="mr-3 h-4 w-4 text-cyan-400" />
                  ) : (
                    <MapPin className="mr-3 h-4 w-4 text-lime-400" />
                  )}
                  <span className="font-mono text-cyan-400 mr-2">{item.value}</span>
                  <span className="text-slate-400">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Popular Airports">
              {popularAirports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  onSelect={() => handleSearch(airport.code)}
                >
                  <MapPin className="mr-3 h-4 w-4 text-lime-400" />
                  <span className="font-mono text-lime-400 mr-2">{airport.code}</span>
                  <span className="text-slate-400">{airport.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <CommandGroup heading="Search">
            <CommandItem onSelect={() => handleSearch(query.toUpperCase())}>
              <Search className="mr-3 h-4 w-4 text-cyan-400" />
              <span>Search for </span>
              <span className="font-mono text-cyan-400 ml-1">{query.toUpperCase()}</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
      <div className="border-t border-slate-700 p-2 text-xs text-slate-500 flex justify-between">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to search</span>
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close</span>
      </div>
    </CommandDialog>
  )
}
