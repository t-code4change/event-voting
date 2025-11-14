"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, Trophy, Users, Vote, TrendingUp, Award, Crown, ExternalLink, Settings as SettingsIcon, ArrowUp } from "lucide-react"
import { toast } from "sonner"
import { AdminCard, AdminPageHeader, AdminButton, AdminLiveIndicator } from "@/components/admin"

interface Candidate {
  id: string
  name: string
  photo_url: string | null
  description: string | null
  display_order: number
  voteCount: number
}

interface Category {
  id: string
  name: string
  emoji: string | null
  max_votes_per_voter: number
  display_order: number
  candidates: Candidate[]
}

interface Event {
  id: string
  name: string
  is_active: boolean
  voting_start_time: string
  voting_end_time: string
  categories: Category[]
}

export default function AdminResultsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [totalVoters, setTotalVoters] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const response = await fetch("/api/admin/results")
      if (!response.ok) throw new Error("Failed to fetch results")

      const data = await response.json()
      setEvents(data.events || [])
      setTotalVoters(data.totalVoters || 0)
      setTotalVotes(data.totalVotes || 0)
    } catch (error) {
      console.error("Error loading results:", error)
      toast.error("Không thể tải kết quả bình chọn")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getMaxVotes = (candidates: Candidate[]) => {
    return Math.max(...candidates.map(c => c.voteCount), 0)
  }

  const totalCategories = events.reduce((sum, e) => sum + (e.categories?.length || 0), 0)
  const totalCandidates = events.reduce(
    (sum, e) => sum + (e.categories?.reduce((s, c) => s + (c.candidates?.length || 0), 0) || 0),
    0
  )
  const voteRate = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(1) : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-8"
    >
      {/* Header */}
      <AdminPageHeader
        title="Kết quả Bình chọn"
        description="Hiển thị kết quả bình chọn theo thời gian thực"
        icon={BarChart3}
        actions={
          <div className="flex items-center gap-3">
            <AdminLiveIndicator text="LIVE NOW" />
            <AdminButton icon={ExternalLink}>
              Open Result LED
            </AdminButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Trophy} label="Danh mục" value={totalCategories} delay={0} />
        <StatCard icon={Users} label="Ứng viên" value={totalCandidates} delay={0.05} />
        <StatCard icon={Vote} label="Tổng vote" value={totalVotes} delay={0.1} />
        <StatCard icon={TrendingUp} label="Người vote" value={totalVoters} delay={0.15} />
        <StatCard icon={Users} label="Chưa vote" value={Math.max(0, 300 - totalVoters)} delay={0.2} />
        <StatCard icon={BarChart3} label="Tỉ lệ" value={`${voteRate}%`} delay={0.25} />
      </div>

      {/* Loading State */}
      {loading ? (
        <AdminCard className="p-12 text-center">
          <p className="text-white/60">Đang tải kết quả...</p>
        </AdminCard>
      ) : events.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#FFD700] opacity-50" strokeWidth={2} />
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có sự kiện nào</h3>
          <p className="text-white/60">
            Tạo sự kiện và danh mục để bắt đầu nhận votes
          </p>
        </AdminCard>
      ) : (
        /* Results by Event */
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="space-y-6">
              {event.categories?.map((category) => {
                const maxVotes = getMaxVotes(category.candidates || [])
                const totalCategoryVotes = (category.candidates || []).reduce(
                  (sum, c) => sum + c.voteCount,
                  0
                )

                return (
                  <AdminCard key={category.id}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FFD700]/10 border border-[#FFD700]/30">
                          <Award className="w-6 h-6 text-[#FFD700]" strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            {category.emoji && <span className="text-2xl">{category.emoji}</span>}
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/60">
                            {category.candidates?.length || 0} ứng viên • {totalCategoryVotes} votes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {category.candidates
                        ?.sort((a, b) => b.voteCount - a.voteCount)
                        .map((candidate, index) => {
                          const percentage = maxVotes > 0 ? (candidate.voteCount / maxVotes) * 100 : 0
                          const isTop1 = index === 0

                          return (
                            <motion.div
                              key={candidate.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="rounded-xl p-4 border"
                              style={{
                                background: isTop1 ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255,255,255,0.05)',
                                borderColor: isTop1 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)',
                              }}
                            >
                              <div className="flex items-center gap-4 mb-3">
                                {/* Rank */}
                                <div className="flex-shrink-0 w-10 text-center">
                                  {index === 0 && (
                                    <Crown className="w-6 h-6 mx-auto text-[#FFD700]" strokeWidth={2} />
                                  )}
                                  {index === 1 && (
                                    <Trophy className="w-6 h-6 mx-auto text-white/50" strokeWidth={2} />
                                  )}
                                  {index === 2 && (
                                    <Award className="w-6 h-6 mx-auto text-[#D9A837]/70" strokeWidth={2} />
                                  )}
                                  {index > 2 && (
                                    <span className="text-lg font-bold text-white/30">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>

                                {/* Avatar */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#FFD700]/10 border border-[#FFD700]/30">
                                  {candidate.photo_url ? (
                                    <img
                                      src={candidate.photo_url}
                                      alt={candidate.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-bold text-[#FFD700]">
                                      {getInitials(candidate.name)}
                                    </span>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">{candidate.name}</p>
                                  {candidate.description && (
                                    <p className="text-sm truncate text-white/60">
                                      {candidate.description}
                                    </p>
                                  )}
                                </div>

                                {/* Vote Count */}
                                <div className="text-right flex-shrink-0">
                                  <p
                                    className="text-2xl font-bold tabular-nums"
                                    style={{ color: isTop1 ? '#FFD700' : 'white' }}
                                  >
                                    {candidate.voteCount}
                                  </p>
                                  <p className="text-xs text-white/40">
                                    {percentage.toFixed(1)}%
                                  </p>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="h-2 rounded-full overflow-hidden bg-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.05 }}
                                  className="h-full rounded-full"
                                  style={{
                                    background: isTop1
                                      ? '#FFD700'
                                      : 'rgba(255, 215, 0, 0.4)',
                                  }}
                                />
                              </div>
                            </motion.div>
                          )
                        })}
                    </div>
                  </AdminCard>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      <AdminCard>
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#FFD700]" strokeWidth={2} />
          Cài đặt hiển thị Result
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <SettingToggle label="Hiển thị %" enabled={true} />
          <SettingToggle label="Hiển thị số phiếu" enabled={true} />
          <SettingToggle label="Award Mode" enabled={true} />
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all">
            Reset kết quả
          </button>
        </div>
      </AdminCard>
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="rounded-xl p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
    >
      <Icon className="w-5 h-5 mb-2 text-[#FFD700] opacity-70" strokeWidth={2} />
      <p className="text-3xl font-bold text-white tabular-nums mb-1">{value}</p>
      <p className="text-sm text-white/60">
        {label}
      </p>
    </motion.div>
  )
}

function SettingToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20">
      <span className="text-sm font-medium text-white/85">
        {label}
      </span>
      <div
        className="relative w-12 h-6 rounded-full"
        style={{
          background: enabled ? '#FFD700' : 'rgba(255,255,255,0.1)',
        }}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full"
          style={{
            background: enabled ? '#000' : 'rgba(255,255,255,0.4)',
          }}
        />
      </div>
    </div>
  )
}
