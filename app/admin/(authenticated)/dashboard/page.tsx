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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
      style={{ background: '#0C0F15' }}
    >
      {/* 🟦 1) KHU VỰC THÔNG TIN SỰ KIỆN */}
      <section className="space-y-6">
        {/* Card 1 – Trạng thái sự kiện */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Event Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">GLOW UP 2025</h1>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(245, 194, 66, 0.15)',
                    border: '1px solid rgba(245, 194, 66, 0.3)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: '#F5C242',
                      boxShadow: '0 0 8px rgba(245, 194, 66, 0.6)',
                    }}
                  />
                  <span className="font-semibold text-sm" style={{ color: '#F5C242' }}>
                    LIVE NOW
                  </span>
                </div>
              </div>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Year End Party – Pacific Wide
              </p>
            </div>

            {/* Right: Countdown */}
            <div className="text-right">
              <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Thời gian còn lại
              </p>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: '#0C0F15',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                  </div>
                  <span
                    className="text-[10px] mt-1 block uppercase"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Giờ
                  </span>
                </div>
                <span className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  :
                </span>
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: '#0C0F15',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                  </div>
                  <span
                    className="text-[10px] mt-1 block uppercase"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Phút
                  </span>
                </div>
                <span className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  :
                </span>
                <motion.div
                  key={timeLeft.seconds}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: '#0C0F15',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  <span
                    className="text-[10px] mt-1 block uppercase"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Giây
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 – Tổng quan số liệu (4 cards) */}
        <div className="grid grid-cols-4 gap-6">
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
      </section>

      {/* 🟩 2) KHU ĐIỀU KHIỂN NHANH */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.2 }}
        className="rounded-2xl p-6"
        style={{
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
          <MonitorPlay className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
          Màn hình & Tính năng sự kiện
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <ActionCard icon={MonitorPlay} label="Welcome LED" href="/admin/welcome-led" />
          <ActionCard icon={Tv} label="Waiting Screen" href="/admin/waiting-screen" />
          <ActionCard icon={Vote} label="Voting Page" href="/admin/voting" />
          <ActionCard icon={BarChart3} label="Result LED" href="/admin/result-led" />
          <ActionCard icon={Gift} label="Lucky Draw" href="/admin/lucky-draw" />
          <ActionCard icon={Gamepad2} label="Mini Game" href="/admin/mini-game" />
        </div>
      </motion.section>

      {/* 🟧 3) KHU QUẢN LÝ DỮ LIỆU + 🟨 4) THỐNG KÊ REALTIME */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Data Zone (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="col-span-2 rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
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
        </motion.div>

        {/* Right: Realtime Stats + Activity Log (1 col) */}
        <div className="space-y-6">
          {/* Realtime Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: '#161A23',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
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
          </motion.div>

          {/* 🟪 5) HOẠT ĐỘNG GẦN ĐÂY */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: '#161A23',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
              Hoạt động gần đây
            </h2>

            <div className="relative">
              {/* Timeline vertical line */}
              <div
                className="absolute left-[15px] top-0 bottom-0 w-px"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              />

              <div className="space-y-5">
                <ActivityItem icon={UserCheck} action="Check-in" user="Nguyễn Văn A" time="2 phút trước" />
                <ActivityItem icon={Star} action="Vote" user="Trần Thị B" time="5 phút trước" />
                <ActivityItem icon={Gift} action="Trúng thưởng" user="Lê Văn C" time="8 phút trước" />
                <ActivityItem icon={UserCheck} action="Check-in" user="Phạm Thị D" time="10 phút trước" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Sub-components
function StatCard({ icon: Icon, label, value, subtitle, change, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="rounded-xl p-5 group cursor-pointer"
      style={{
        background: '#161A23',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#F5C242'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
      }}
    >
      <Icon className="w-5 h-5 mb-3 group-hover:opacity-100" style={{ color: '#F2D276', opacity: 0.7 }} strokeWidth={2} />
      <motion.p
        key={value}
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-5xl font-bold text-white tabular-nums mb-2"
      >
        {value}
      </motion.p>
      <div className="flex items-center justify-between">
        <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {label}
        </p>
        {subtitle && (
          <span className="text-sm font-semibold" style={{ color: '#4AD97F' }}>
            {subtitle}
          </span>
        )}
        {change !== undefined && change > 0 && (
          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#4AD97F' }}>
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
        className="rounded-xl p-5 cursor-pointer group"
        style={{
          background: '#0C0F15',
          border: '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#F5C242'
          e.currentTarget.style.background = '#161A23'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
          e.currentTarget.style.background = '#0C0F15'
        }}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <Icon className="w-10 h-10 group-hover:scale-110 transition-transform" style={{ color: '#F2D276' }} strokeWidth={2} />
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {label}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}

function DataItem({ icon: Icon, label, description, href }: any) {
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 p-4 rounded-xl cursor-pointer"
        style={{
          background: '#0C0F15',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#1C202A'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#0C0F15'
        }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#F2D276' }} strokeWidth={2} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {label}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}

function MiniStat({ label, value, change }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-white tabular-nums">{value}</span>
        {change > 0 && (
          <span className="text-xs font-semibold" style={{ color: '#F5C242' }}>
            +{change}
          </span>
        )}
      </div>
    </div>
  )
}

function ActivityItem({ icon: Icon, action, user, time }: any) {
  return (
    <div className="relative flex items-start gap-3">
      {/* Avatar with icon */}
      <div
        className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(245, 194, 66, 0.15)',
          border: '1px solid rgba(245, 194, 66, 0.3)',
        }}
      >
        <Icon className="w-4 h-4" style={{ color: '#F5C242' }} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {user}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {action} • {time}
        </p>
      </div>
    </div>
  )
}
