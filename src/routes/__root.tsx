/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { Plane, Search, Activity, History } from 'lucide-react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { SearchCommand } from '~/components/SearchCommand'
import { Button } from '~/components/ui/button'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'Avitrack | Real-Time Flight Tracker',
        description: 'Track flights in real-time with live telemetry, altitude, speed, and heading data. Your personal aviation dashboard.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = React.useState(false)
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])
  
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Plane className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xl font-bold tracking-wide text-slate-100">
                  AVI<span className="text-cyan-400">TRACK</span>
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
                  activeProps={{ className: 'text-cyan-400 bg-cyan-500/10' }}
                  activeOptions={{ exact: true }}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Live
                </Link>
                <Link
                  to="/history"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
                  activeProps={{ className: 'text-cyan-400 bg-cyan-500/10' }}
                >
                  <History className="w-4 h-4 inline mr-2" />
                  History
                </Link>
              </nav>
              
              <Button
                variant="outline"
                className="w-64 justify-start text-slate-400"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                <span>Search flights...</span>
                <kbd className="ml-auto px-1.5 py-0.5 rounded bg-slate-800 text-xs">⌘K</kbd>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
        
        {/* Search Command Dialog */}
        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
        
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
