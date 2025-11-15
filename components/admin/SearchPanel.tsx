"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Search,
  Users,
  Calendar,
  Trophy,
  Monitor,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface SearchResult {
  guests: Array<{
    id: string
    name: string
    phone: string
    email: string
    checkedIn: boolean
  }>
  events: Array<{
    id: string
    name: string
    status: "live" | "upcoming" | "ended"
    checkins: number
    totalGuests: number
  }>
  categories: Array<{
    id: string
    name: string
    eventName: string
  }>
  candidates: Array<{
    id: string
    name: string
    votes: number
    categoryName: string
  }>
  screens: Array<{
    id: string
    name: string
    route: string
  }>
}

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search when query changes (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/search?query=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleResultClick = (route: string) => {
    router.push(route)
    onClose()
    setQuery("")
    setResults(null)
  }

  const hasResults = results && (
    results.guests.length > 0 ||
    results.events.length > 0 ||
    results.categories.length > 0 ||
    results.candidates.length > 0 ||
    results.screens.length > 0
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="rounded-2xl bg-[#0C0F15] border border-white/20 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative border-b border-white/10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm khách mời, sự kiện, ứng viên..."
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700] animate-spin" />
                )}
                {query && !isLoading && (
                  <button
                    onClick={() => {
                      setQuery("")
                      setResults(null)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[500px] overflow-y-auto">
                {!query && (
                  <div className="p-8 text-center text-white/40 text-sm">
                    Nhập từ khóa để tìm kiếm...
                  </div>
                )}

                {query && !isLoading && !hasResults && (
                  <div className="p-8 text-center text-white/40 text-sm">
                    Không tìm thấy kết quả cho "{query}"
                  </div>
                )}

                {hasResults && (
                  <div className="p-4 space-y-4">
                    {/* Guests */}
                    {results.guests.length > 0 && (
                      <ResultGroup
                        title="Khách mời"
                        icon={Users}
                        items={results.guests.map((guest) => ({
                          id: guest.id,
                          title: guest.name,
                          subtitle: `${guest.phone} · ${guest.email}`,
                          badge: guest.checkedIn ? (
                            <span className="flex items-center gap-1 text-xs text-green-500">
                              <CheckCircle className="w-3 h-3" />
                              Đã check-in
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <XCircle className="w-3 h-3" />
                              Chưa check-in
                            </span>
                          ),
                          onClick: () => handleResultClick(`/admin/guests/${guest.id}`),
                        }))}
                      />
                    )}

                    {/* Events */}
                    {results.events.length > 0 && (
                      <ResultGroup
                        title="Sự kiện"
                        icon={Calendar}
                        items={results.events.map((event) => ({
                          id: event.id,
                          title: event.name,
                          subtitle: `${event.checkins}/${event.totalGuests} khách`,
                          badge: (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                event.status === "live"
                                  ? "bg-green-500/10 text-green-500"
                                  : event.status === "upcoming"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-gray-500/10 text-gray-500"
                              }`}
                            >
                              {event.status === "live"
                                ? "LIVE"
                                : event.status === "upcoming"
                                ? "SẮP DIỄN RA"
                                : "ĐÃ KẾT THÚC"}
                            </span>
                          ),
                          onClick: () => handleResultClick(`/admin/events/${event.id}`),
                        }))}
                      />
                    )}

                    {/* Candidates */}
                    {results.candidates.length > 0 && (
                      <ResultGroup
                        title="Ứng viên"
                        icon={Trophy}
                        items={results.candidates.map((candidate) => ({
                          id: candidate.id,
                          title: candidate.name,
                          subtitle: candidate.categoryName,
                          badge: (
                            <span className="text-xs text-[#FFD700] font-semibold">
                              {candidate.votes} votes
                            </span>
                          ),
                          onClick: () => handleResultClick(`/admin/candidates/${candidate.id}`),
                        }))}
                      />
                    )}

                    {/* Screens */}
                    {results.screens.length > 0 && (
                      <ResultGroup
                        title="Màn hình"
                        icon={Monitor}
                        items={results.screens.map((screen) => ({
                          id: screen.id,
                          title: screen.name,
                          subtitle: "",
                          badge: null,
                          onClick: () => handleResultClick(screen.route),
                        }))}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ResultGroupProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: Array<{
    id: string
    title: string
    subtitle: string
    badge: React.ReactNode
    onClick: () => void
  }>
}

function ResultGroup({ title, icon: Icon, items }: ResultGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-2">
        <Icon className="w-4 h-4 text-[#FFD700]" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-white/60 truncate mt-0.5">{item.subtitle}</p>
                )}
              </div>
              {item.badge && <div className="ml-3 flex-shrink-0">{item.badge}</div>}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
