"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Bell,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown,
  Crown,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Event {
  id: string
  name: string
  date: string
  status: "live" | "upcoming" | "ended"
  stats: {
    checkins: number
    votes: number
    totalGuests: number
  }
}

// Mock data - replace with real data
const mockEvents: Event[] = [
  {
    id: "1",
    name: "GLOW UP 2025",
    date: "2025-01-14",
    status: "live",
    stats: {
      checkins: 234,
      votes: 1520,
      totalGuests: 300,
    },
  },
  {
    id: "2",
    name: "Summer Party 2024",
    date: "2024-08-20",
    status: "ended",
    stats: {
      checkins: 180,
      votes: 980,
      totalGuests: 200,
    },
  },
]

export default function AdminHeader() {
  const [selectedEvent, setSelectedEvent] = useState<Event>(mockEvents[0])
  const [isDark, setIsDark] = useState(true)

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "live":
        return "bg-green-500 text-green-500"
      case "upcoming":
        return "bg-blue-500 text-blue-500"
      case "ended":
        return "bg-gray-500 text-gray-500"
    }
  }

  const getStatusLabel = (status: Event["status"]) => {
    switch (status) {
      case "live":
        return "LIVE"
      case "upcoming":
        return "SẮP DIỄN RA"
      case "ended":
        return "ĐÃ KẾT THÚC"
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />

      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Event Selector */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FFD700]/40 transition-all group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Calendar className="w-5 h-5 text-[#FFD700]" />
                  {selectedEvent.status === "live" && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {selectedEvent.name}
                    </span>
                    <span
                      className={`
                        inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full
                        ${getStatusColor(selectedEvent.status)} bg-opacity-20
                      `}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedEvent.status).split(' ')[0]}`}
                      />
                      {getStatusLabel(selectedEvent.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/40">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {selectedEvent.stats.checkins}/{selectedEvent.stats.totalGuests}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {selectedEvent.stats.votes} votes
                    </span>
                  </div>
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-80 bg-[#1A1A1A] border-white/10 p-2"
            >
              <DropdownMenuLabel className="text-white/60 text-xs uppercase tracking-wider px-3">
                Chọn sự kiện
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />

              {mockEvents.map((event) => (
                <DropdownMenuItem
                  key={event.id}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all
                    ${selectedEvent.id === event.id
                      ? 'bg-[#FFD700]/20 border border-[#FFD700]/40'
                      : 'hover:bg-white/5'
                    }
                  `}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {event.name}
                        </span>
                        <span
                          className={`
                            inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full
                            ${getStatusColor(event.status)} bg-opacity-20
                          `}
                        >
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{event.date}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-white/5 my-2" />

              <DropdownMenuItem className="p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                <Calendar className="w-4 h-4 text-[#FFD700] mr-2" />
                <span className="text-sm text-white">Tạo sự kiện mới</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Open Event Page */}
          <motion.a
            href={`/event/${selectedEvent.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            Open Event Page
          </motion.a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-[#FFD700]/40 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all group">
            <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            <motion.span
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl hover:bg-white/5 transition-all group"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* Settings */}
          <button className="p-2 rounded-xl hover:bg-white/5 transition-all group">
            <Settings className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] flex items-center justify-center text-black font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-white">Admin</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-white/10">
              <DropdownMenuLabel className="text-white">
                admin@bright4event.com
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="text-white hover:bg-white/5">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/5">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
