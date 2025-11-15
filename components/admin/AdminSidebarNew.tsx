"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Calendar,
  Users,
  UserCheck,
  MonitorPlay,
  Tv,
  Vote,
  BarChart3,
  Gift,
  Gamepad2,
  TrendingUp,
  Settings,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  badge?: string
  glow?: "gold" | "purple" | "blue" | "cyan" | "pink"
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/admin/dashboard",
    glow: "gold",
  },
  {
    label: "Sự kiện",
    icon: Calendar,
    href: "/admin/events",
    glow: "purple",
  },
  {
    label: "Khách mời",
    icon: Users,
    href: "/admin/guests",
    glow: "cyan",
  },
  {
    label: "Check-in",
    icon: UserCheck,
    href: "/admin/check-in",
    glow: "blue",
  },
  {
    label: "Welcome LED",
    icon: MonitorPlay,
    href: "/admin/welcome-led",
    glow: "pink",
  },
  {
    label: "Waiting Screen",
    icon: Tv,
    href: "/admin/waiting-screen",
    glow: "cyan",
  },
  {
    label: "Voting",
    icon: Vote,
    href: "/admin/voting",
    glow: "purple",
  },
  {
    label: "Result LED",
    icon: BarChart3,
    href: "/admin/result-led",
    glow: "gold",
  },
  // {
  //   label: "Lucky Draw",
  //   icon: Gift,
  //   href: "/admin/lucky-draw",
  //   glow: "pink",
  // },
  {
    label: "Mini Game",
    icon: Gamepad2,
    href: "/admin/mini-game",
    glow: "cyan",
  },
  {
    label: "Analytics",
    icon: TrendingUp,
    href: "/admin/analytics",
    glow: "blue",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

const glowColors = {
  gold: "#FFD700",
  purple: "#A855F7",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  pink: "#EC4899",
}

export default function AdminSidebarNew() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <motion.aside
      className="relative h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] border-r border-white/10"
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Background particle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Crown className="w-8 h-8 text-[#FFD700]" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      filter: [
                        "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))",
                        "drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))",
                        "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-8 h-8 text-[#FFD700] opacity-0" />
                  </motion.div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFD700] bg-clip-text text-transparent">
                    Bright4Event
                  </h1>
                  <p className="text-[10px] text-[#FFD700]/60 tracking-wider uppercase">
                    Event Control
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <Crown className="w-8 h-8 text-[#FFD700]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-20 w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-black" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-black" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`
                      relative group flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300 cursor-pointer overflow-hidden
                      ${active
                        ? 'bg-gradient-to-r from-[#FFD700]/20 to-transparent border border-[#FFD700]/50'
                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={
                      active
                        ? {
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)',
                          }
                        : {}
                    }
                  >
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                        style={{
                          background: 'linear-gradient(to bottom, #FFD700, #FFC107)',
                          boxShadow: '0 0 10px #FFD700',
                        }}
                        layoutId="activeIndicator"
                      />
                    )}

                    {/* Icon with neon glow */}
                    <div className="relative flex-shrink-0">
                      <Icon
                        className={`w-5 h-5 ${
                          active ? 'text-[#FFD700]' : 'text-white/60 group-hover:text-white'
                        }`}
                        style={
                          item.glow
                            ? {
                                filter: active
                                  ? `drop-shadow(0 0 6px ${glowColors[item.glow]}) drop-shadow(0 0 12px ${glowColors[item.glow]}40)`
                                  : 'none',
                              }
                            : {}
                        }
                      />
                      {item.glow && active && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Icon
                            className="w-5 h-5 opacity-0"
                            style={{
                              filter: `drop-shadow(0 0 8px ${glowColors[item.glow]})`,
                            }}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`text-sm font-medium ${
                          active ? 'text-white' : 'text-white/60 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {/* Badge */}
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-[#FFD700] text-black rounded-full">
                        {item.badge}
                      </span>
                    )}

                    {/* Light sweep effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: active ? '-100%' : '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </motion.aside>
  )
}
