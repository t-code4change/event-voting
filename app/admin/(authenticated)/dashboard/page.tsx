"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Users,
  UserCheck,
  Vote,
  TrendingUp,
  Gift,
  Clock,
  MonitorPlay,
  Tv,
  BarChart3,
  Gamepad2,
  Calendar,
  FileDown,
  Settings as SettingsIcon,
  ArrowUp,
  Star,
} from "lucide-react"

// Dashboard Custom Card Component
function DashboardCard({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={`rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Mock realtime stats with updates
const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    totalGuests: 300,
    checkedIn: 300,
    totalVotes: 1699,
    voters: 246,
    luckyDrawSpins: 42,
    miniGamePlayers: 156,
  })

  const [prevStats, setPrevStats] = useState(stats)

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        setPrevStats(prev)
        return {
          ...prev,
          totalVotes: prev.totalVotes + Math.floor(Math.random() * 5),
          voters: Math.min(prev.voters + Math.floor(Math.random() * 2), prev.checkedIn),
          luckyDrawSpins: prev.luckyDrawSpins + (Math.random() > 0.7 ? 1 : 0),
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return { stats, prevStats }
}

export default function AdminDashboard() {
  const { stats, prevStats } = useRealtimeStats()
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 29, seconds: 54 })

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const checkinRate = ((stats.checkedIn / stats.totalGuests) * 100).toFixed(0)
  const voteRate = ((stats.voters / stats.checkedIn) * 100).toFixed(0)

  // Calculate changes
  const voteChange = stats.totalVotes - prevStats.totalVotes
  const voterChange = stats.voters - prevStats.voters

  return (
    <div className="min-h-screen bg-[#0C0F15] space-y-6">
      {/* 1. Event Info Card */}
      <DashboardCard>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Event Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">GLOW UP 2025</h1>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                <span className="font-semibold text-sm text-[#FFD700]">LIVE NOW</span>
              </div>
            </div>
            <p className="text-base text-white/55">Year End Party – Pacific Wide</p>
          </div>

          {/* Right: Countdown */}
          <div className="w-full lg:w-auto">
            <p className="text-sm mb-2 text-white/55 text-center lg:text-right">Thời gian còn lại</p>
            <div className="flex items-center justify-center lg:justify-end gap-2">
              <TimeBox value={timeLeft.hours} label="Giờ" />
              <span className="text-xl text-white/40">:</span>
              <TimeBox value={timeLeft.minutes} label="Phút" />
              <span className="text-xl text-white/40">:</span>
              <TimeBox value={timeLeft.seconds} label="Giây" animate />
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard icon={Users} label="Tổng khách" value={stats.totalGuests} delay={0.05} />
        <StatCard
          icon={UserCheck}
          label="Đã check-in"
          value={stats.checkedIn}
          subtitle={`${checkinRate}%`}
          delay={0.1}
        />
        <StatCard icon={Vote} label="Tổng phiếu" value={stats.totalVotes} change={voteChange} delay={0.15} />
        <StatCard
          icon={TrendingUp}
          label="Người đã vote"
          value={stats.voters}
          subtitle={`${voteRate}%`}
          change={voterChange}
          delay={0.2}
        />
      </div>

      {/* 3. Screen Controls */}
      <DashboardCard delay={0.25}>
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-5 flex items-center gap-2">
          <MonitorPlay className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
          Màn hình & Tính năng sự kiện
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          <ActionCard icon={MonitorPlay} label="Welcome LED" href="/admin/welcome-led" />
          <ActionCard icon={Tv} label="Waiting Screen" href="/admin/waiting-screen" />
          <ActionCard icon={Vote} label="Voting Page" href="/admin/voting" />
          <ActionCard icon={BarChart3} label="Result LED" href="/admin/result-led" />
          <ActionCard icon={Gamepad2} label="Mini Game" href="/admin/mini-game" />
        </div>
      </DashboardCard>

      {/* 4. Data Management + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Data Management (2 cols) */}
        <DashboardCard delay={0.3} className="lg:col-span-2">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
            Quản lý dữ liệu
          </h2>

          <div className="space-y-2">
            <DataItem icon={Vote} label="Danh mục" description="Quản lý voting" href="/admin/categories" />
            <DataItem icon={Users} label="Ứng viên" description="Quản lý candidates" href="/admin/candidates" />
            <DataItem
              icon={BarChart3}
              label="Kết quả"
              description={`${stats.totalVotes} votes`}
              href="/admin/results"
            />
            <DataItem icon={TrendingUp} label="Analytics" description="Live Data charts" href="/admin/analytics" />
            <DataItem icon={Calendar} label="Sự kiện" description="Quản lý events" href="/admin/events" />
            <DataItem icon={FileDown} label="Export Data" description="Excel/PDF" href="#" />
          </div>
        </DashboardCard>

        {/* Right: Realtime Stats + Activity */}
        <div className="space-y-6">
          {/* Realtime Stats */}
          <DashboardCard delay={0.35}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Thống kê realtime
            </h2>

            <div className="space-y-4">
              <MiniStat label="Tổng khách mời" value={stats.totalGuests} change={0} />
              <MiniStat label="Đã check-in" value={stats.checkedIn} change={0} />
              <MiniStat label="% check-in" value={`${checkinRate}%`} change={0} />
              <MiniStat label="Tổng vote" value={stats.totalVotes} change={voteChange} />
              <MiniStat label="Người đã vote" value={stats.voters} change={voterChange} />
              <MiniStat label="Lượt quay số" value={stats.luckyDrawSpins} change={stats.luckyDrawSpins - 42} />
            </div>
          </DashboardCard>

          {/* Activity Log */}
          <DashboardCard delay={0.4}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
              Hoạt động gần đây
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/10" />

              <div className="space-y-5">
                <ActivityItem icon={UserCheck} action="Check-in" user="Nguyễn Văn A" time="2 phút trước" />
                <ActivityItem icon={Star} action="Vote" user="Trần Thị B" time="5 phút trước" />
                <ActivityItem icon={Gift} action="Trúng thưởng" user="Lê Văn C" time="8 phút trước" />
                <ActivityItem icon={UserCheck} action="Check-in" user="Phạm Thị D" time="10 phút trước" />
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

// Sub-home
function TimeBox({ value, label, animate = false }: { value: number; label: string; animate?: boolean }) {
  const BoxContent = (
    <div className="text-center">
      <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-xl bg-[#0C0F15] border border-white/5 flex items-center justify-center">
        <span className="text-xl lg:text-2xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] mt-1 block uppercase text-white/40">{label}</span>
    </div>
  )

  if (animate) {
    return (
      <motion.div key={value} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}>
        {BoxContent}
      </motion.div>
    )
  }

  return BoxContent
}

function StatCard({ icon: Icon, label, value, subtitle, change, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl p-5 group cursor-pointer transition-all hover:border-[#FFD700]"
    >
      <Icon className="w-5 h-5 mb-3 text-[#FFD700]/70 group-hover:text-[#FFD700] transition-colors" strokeWidth={2} />
      <motion.p
        key={value}
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-4xl lg:text-5xl font-bold text-white tabular-nums mb-2"
      >
        {value}
      </motion.p>
      <div className="flex items-center justify-between">
        <p className="text-sm lg:text-base text-white/55">{label}</p>
        {subtitle && <span className="text-sm font-semibold text-green-400">{subtitle}</span>}
        {change !== undefined && change > 0 && (
          <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
            <ArrowUp className="w-3 h-3" strokeWidth={2} />
            +{change}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function ActionCard({ icon: Icon, label, href }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-white/5 border border-white/20 p-4 lg:p-5 cursor-pointer group transition-all hover:border-[#FFD700] hover:bg-white/10"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <Icon
            className="w-8 lg:w-10 h-8 lg:h-10 text-[#FFD700] group-hover:scale-110 transition-transform"
            strokeWidth={2}
          />
          <p className="text-xs lg:text-sm font-semibold text-white/85">{label}</p>
        </div>
      </motion.div>
    </Link>
  )
}

function DataItem({ icon: Icon, label, description, href }: any) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer transition-all hover:bg-white/10 hover:border-white/20">
        <Icon className="w-5 h-5 flex-shrink-0 text-[#FFD700]" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/85 truncate">{label}</p>
          <p className="text-xs text-white/50 truncate">{description}</p>
        </div>
      </div>
    </Link>
  )
}

function MiniStat({ label, value, change }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/55">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-white tabular-nums">{value}</span>
        {change > 0 && <span className="text-xs font-semibold text-[#FFD700]">+{change}</span>}
      </div>
    </div>
  )
}

function ActivityItem({ icon: Icon, action, user, time }: any) {
  return (
    <div className="relative flex items-start gap-3">
      {/* Icon badge */}
      <div className="relative z-10 w-8 h-8 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#FFD700]" strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/85 truncate">{user}</p>
        <p className="text-xs text-white/50">
          {action} • {time}
        </p>
      </div>
    </div>
  )
}
