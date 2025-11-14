"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  Users,
  Vote,
  Clock,
  Smartphone,
  Monitor,
  FileDown,
  Calendar,
  Activity,
  ArrowUp,
} from "lucide-react"
import { SubscriptionStatsResponse } from "@/types/subscription"

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<SubscriptionStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for voting analytics
  const mockVotingStats = {
    totalVotes: 1699,
    totalVoters: 246,
    totalCheckIns: 300,
    peakTime: "20:30",
    deviceMobile: 82,
    deviceDesktop: 18,
    returningVoters: 15,
    newVoters: 85,
    votesByCategory: [
      { name: "King of the Year", votes: 680 },
      { name: "Queen of the Year", votes: 520 },
      { name: "Best Performer", votes: 499 },
    ],
    voteTimeline: [
      { time: "18:00", votes: 50 },
      { time: "19:00", votes: 150 },
      { time: "20:00", votes: 400 },
      { time: "21:00", votes: 650 },
      { time: "22:00", votes: 1100 },
      { time: "23:00", votes: 1699 },
    ],
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0C0F15' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)' }}>Đang tải...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
      style={{ background: '#0C0F15' }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <BarChart3 className="w-7 h-7" style={{ color: '#F2D276' }} strokeWidth={2} />
          Analytics & Dashboard
        </h1>
        <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Phân tích hành vi & dữ liệu từ bình chọn và check-in
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          icon={Vote}
          label="Tổng vote"
          value={mockVotingStats.totalVotes}
          change={124}
          delay={0}
        />
        <MetricCard
          icon={Users}
          label="Người vote"
          value={mockVotingStats.totalVoters}
          change={15}
          delay={0.05}
        />
        <MetricCard
          icon={Users}
          label="Check-in"
          value={mockVotingStats.totalCheckIns}
          change={8}
          delay={0.1}
        />
        <MetricCard
          icon={Clock}
          label="Peak Time"
          value={mockVotingStats.peakTime}
          change={null}
          delay={0.15}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Vote Timeline - Takes 2 columns */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
            <h2 className="text-lg font-semibold text-white">Vote Timeline</h2>
          </div>

          <div className="space-y-4">
            {mockVotingStats.voteTimeline.map((item, index) => {
              const maxVotes = Math.max(...mockVotingStats.voteTimeline.map(v => v.votes))
              const percentage = (item.votes / maxVotes) * 100
              const isPeak = item.votes === maxVotes

              return (
                <div key={index} className="relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {item.time}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {item.votes}
                      </span>
                      {isPeak && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{
                            background: 'rgba(232, 201, 106, 0.15)',
                            color: '#E8C96A',
                          }}
                        >
                          Peak
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: '#2A2E38' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="h-full rounded-full relative"
                      style={{
                        background: isPeak ? '#E8C96A' : 'rgba(232, 201, 106, 0.7)',
                      }}
                    >
                      {isPeak && (
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                          style={{
                            background: '#E8C96A',
                            boxShadow: '0 0 8px rgba(232, 201, 106, 0.6)',
                          }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Categories - Takes 1 column */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
            <h2 className="text-lg font-semibold text-white">Top Categories</h2>
          </div>

          <div className="space-y-4">
            {mockVotingStats.votesByCategory
              .sort((a, b) => b.votes - a.votes)
              .map((category, index) => {
                const maxVotes = Math.max(...mockVotingStats.votesByCategory.map(c => c.votes))
                const percentage = (category.votes / maxVotes) * 100

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {category.votes}
                      </span>
                    </div>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: '#2A2E38' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background: 'rgba(232, 201, 106, 0.8)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Device Type & Voter Type */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Device Type */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
            <h2 className="text-lg font-semibold text-white">Device Type</h2>
          </div>

          <div className="space-y-4">
            <DeviceItem
              icon={Smartphone}
              label="Mobile"
              value={mockVotingStats.deviceMobile}
              total={100}
              color="#E8C96A"
            />
            <DeviceItem
              icon={Monitor}
              label="Desktop"
              value={mockVotingStats.deviceDesktop}
              total={100}
              color="#505460"
            />
          </div>
        </div>

        {/* Voter Type */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#161A23',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
            <h2 className="text-lg font-semibold text-white">Voter Type</h2>
          </div>

          <div className="space-y-4">
            <DeviceItem
              icon={Users}
              label="New Voters"
              value={mockVotingStats.newVoters}
              total={100}
              color="#E8C96A"
            />
            <DeviceItem
              icon={TrendingUp}
              label="Returning"
              value={mockVotingStats.returningVoters}
              total={100}
              color="#8A7F4A"
            />
          </div>
        </div>
      </div>

      {/* Event Performance */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
          <h2 className="text-lg font-semibold text-white">Event Performance</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceItem
            label="Tốc độ tăng vote"
            value="5.2"
            unit="votes/phút"
            icon={TrendingUp}
          />
          <PerformanceItem
            label="Tỷ lệ tham gia"
            value="82"
            unit="%"
            icon={Users}
          />
          <PerformanceItem
            label="Avg votes/voter"
            value="6.9"
            unit="votes"
            icon={Vote}
          />
          <PerformanceItem
            label="Dự đoán hoàn tất"
            value="23:45"
            unit=""
            icon={Clock}
          />
        </div>
      </div>

      {/* Export Section */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: '#161A23',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <FileDown className="w-5 h-5" style={{ color: '#F2D276' }} strokeWidth={2} />
          <h2 className="text-lg font-semibold text-white">Export Data</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <ExportButton label="Export Excel" />
          <ExportButton label="Export PDF" />
          <ExportButton label="Export JSON" />
        </div>
      </div>
    </motion.div>
  )
}

function MetricCard({ icon: Icon, label, value, change, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="rounded-xl p-6 group cursor-pointer"
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
      <Icon className="w-5 h-5 mb-4" style={{ color: '#F2D276' }} strokeWidth={2} />
      <p className="text-3xl font-bold text-white tabular-nums mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </p>
        {change !== null && change > 0 && (
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" style={{ color: '#4AD97F' }} strokeWidth={2} />
            <span className="text-xs font-semibold" style={{ color: '#4AD97F' }}>
              +{change}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DeviceItem({ icon: Icon, label, value, total, color }: any) {
  const percentage = (value / total) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={2} />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {label}
          </span>
        </div>
        <span className="text-sm font-semibold text-white">
          {value}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: '#2A2E38' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

function PerformanceItem({ label, value, unit, icon: Icon }: any) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: '#0C0F15',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Icon className="w-4 h-4 mb-3" style={{ color: '#F2D276' }} strokeWidth={2} />
      <p className="text-2xl font-bold text-white tabular-nums">
        {value}
        {unit && <span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{unit}</span>}
      </p>
      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </p>
    </div>
  )
}

function ExportButton({ label }: { label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm"
      style={{
        background: 'transparent',
        border: '1px solid #F5C242',
        color: 'rgba(255,255,255,0.9)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(245, 194, 66, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <FileDown className="w-4 h-4" style={{ color: '#F2D276' }} strokeWidth={2} />
      {label}
    </motion.button>
  )
}
