"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Header from "@/components/Header"
import { CheckCircle2, Loader2, Lock, Crown, Sparkles, Smile, Palette, Check, Eye } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"
import Link from "next/link"
import { useGetEventConfigQuery } from "@/store/api/hono/eventsApi"

interface Candidate {
  id: string
  name: string
  photoUrl?: string
  bio?: string
}

interface Category {
  id: string
  name: string
  description?: string
  maxVotesPerVoter: number
  votingEndAt?: string
  candidates: Candidate[]
}

// Category icon mapping
const getCategoryIcon = (categoryName: string) => {
  if (categoryName.toLowerCase().includes('king')) return Crown
  if (categoryName.toLowerCase().includes('queen')) return Crown
  if (categoryName.toLowerCase().includes('smile')) return Smile
  if (categoryName.toLowerCase().includes('creative')) return Palette
  return Sparkles
}

// Candidate Card Component
interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  onToggle: () => void
  votingEnded: boolean
}

function CandidateCard({ candidate, isSelected, onToggle, votingEnded }: CandidateCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!votingEnded ? { scale: 1.05, y: -5 } : {}}
      className="relative group"
    >
      <div
        className={`
          relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl overflow-hidden
          transition-all duration-300 cursor-pointer
          ${isSelected
            ? 'ring-2 ring-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.4)]'
            : 'ring-1 ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
          }
        `}
        onClick={!votingEnded ? onToggle : undefined}
      >
        {/* Spotlight glow */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-20' : ''}`} />

        {/* Selected indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-5 h-5 text-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={candidate.photoUrl}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-[17px] mb-1 truncate">
            {candidate.name}
          </h3>
          <p className="text-white/70 text-[14px] truncate mb-3">
            {candidate.bio}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!votingEnded) onToggle()
            }}
            disabled={votingEnded}
            className={`
              w-full py-2 px-4 rounded-full text-sm font-semibold
              transition-all duration-300 flex items-center justify-center gap-2
              ${isSelected
                ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                : 'bg-white/10 text-white hover:bg-white/20'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Đã chọn
              </>
            ) : (
              'Chọn'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// LED Countdown Timer
interface CountdownDisplayProps {
  endTime: Date
  onTimeUp: () => void
}

function CountdownDisplay({ endTime, onTimeUp }: CountdownDisplayProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        onTimeUp()
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          hours: Math.floor(distance / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-[#FFD700]/20 to-purple-600/20 blur-xl" />
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-6 border border-white/10">
        <p className="text-center text-[#FFD700] text-sm font-semibold mb-3 tracking-wide uppercase">
          Thời gian còn lại
        </p>
        <div className="flex items-center justify-center gap-2">
          {(['hours', 'minutes', 'seconds'] as const).map((unit, idx) => (
            <div key={unit} className="flex items-center gap-2">
              {idx > 0 && <span className="text-[#FFD700] text-2xl font-bold">:</span>}
              <div className="flex gap-1">
                {pad(timeLeft[unit]).split('').map((digit, i) => (
                  <div key={i} className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
                    <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 mt-2">
          {['Giờ', 'Phút', 'Giây'].map(label => (
            <span key={label} className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Demo submit success screen
function VoteSuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full flex items-center justify-center"
          style={{ boxShadow: "0 0 60px rgba(255,215,0,0.5)" }}
        >
          <CheckCircle2 className="w-16 h-16 text-black" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-3"
        >
          <span className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] bg-clip-text text-transparent">
            Bình chọn thành công! 🎉
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-lg mb-8"
        >
          Cảm ơn bạn đã tham gia bình chọn!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-[#FFD700] text-black font-bold hover:bg-[#FDB931] transition-colors"
          >
            Xem lại bình chọn
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main Voting Page
export default function VotingPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const { data: configData, isLoading: configLoading } = useGetEventConfigQuery(eventId, { skip: !eventId })
  const categories = (configData?.data?.categories ?? []) as Category[]
  const [submitting, setSubmitting] = useState(false)
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string[]>>({})
  const [votingEnded, setVotingEnded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const votingEndTime = useMemo(() => {
    const catEndAt = categories[0]?.votingEndAt
    if (catEndAt) return new Date(catEndAt)
    const end = new Date()
    end.setHours(21, 0, 0, 0)
    if (end.getTime() < Date.now()) end.setDate(end.getDate() + 1)
    return end
  }, [categories])

  const toggleCandidate = (categoryId: string, candidateId: string) => {
    if (votingEnded) return

    setSelectedVotes((prev) => {
      const current = prev[categoryId] || []
      const isSelected = current.includes(candidateId)

      // Find category to check max_votes
      const category = categories.find(c => c.id === categoryId)
      const maxVotes = category?.maxVotesPerVoter ?? 1

      if (isSelected) {
        return { ...prev, [categoryId]: current.filter(id => id !== candidateId) }
      } else {
        if (current.length >= maxVotes) {
          showErrorToast(`Tối đa ${maxVotes} ứng viên`, {
            description: `Mỗi hạng mục chỉ được chọn tối đa ${maxVotes} ứng viên`
          })
          return prev
        }
        return { ...prev, [categoryId]: [...current, candidateId] }
      }
    })
  }

  const getTotalSelectedVotes = () =>
    Object.values(selectedVotes).reduce((sum, votes) => sum + votes.length, 0)

  const handleSubmit = async () => {
    if (votingEnded) return
    if (getTotalSelectedVotes() === 0) {
      showErrorToast("Chưa chọn ứng viên", { description: "Vui lòng chọn ít nhất một ứng viên" })
      return
    }

    setSubmitting(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    setSubmitting(false)
    setShowSuccess(true)
    setHasVoted(true)
  }

  if (configLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Đang tải...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[110px]"
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <Header />

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && <VoteSuccessScreen onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' }} />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-[#FFD700] to-purple-400 bg-clip-text text-transparent">
              GLOW UP 2025
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-2">Year End Party Voting</p>
          <p className="text-white/50">Chọn ứng viên yêu thích của bạn</p>

          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Bạn đã bình chọn thành công
            </motion.div>
          )}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <CountdownDisplay
            endTime={votingEndTime}
            onTimeUp={() => setVotingEnded(true)}
          />
        </motion.div>

        {/* Results link */}
        <div className="flex justify-center mb-12">
          <Link href={`/event/${eventId}/results`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/5 border border-[#FFD700]/30 rounded-full text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all font-semibold flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Xem kết quả
            </motion.button>
          </Link>
        </div>

        {/* Voting ended banner */}
        {votingEnded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4 text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
              <Lock className="w-5 h-5" />
              Đã hết thời gian bình chọn
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const Icon = getCategoryIcon(category.name)

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Icon className="w-10 h-10 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.6))' }} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {category.name}
                    </h2>
                  </div>

                  {category.description && (
                    <p className="text-white/60 text-lg">{category.description}</p>
                  )}

                  <p className="text-[#FFD700] text-sm mt-2">
                    Chọn tối đa {category.maxVotesPerVoter} ứng viên
                  </p>

                  <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
                </div>

                {/* Candidates Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      isSelected={(selectedVotes[category.id] || []).includes(candidate.id)}
                      onToggle={() => toggleCandidate(category.id, candidate.id)}
                      votingEnded={votingEnded}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 py-12"
          >
            <div className="text-center">
              <p className="text-white/60 mb-2">
                Tổng số phiếu đã chọn:{" "}
                <span className="text-[#FFD700] font-bold text-xl">{getTotalSelectedVotes()}</span>
              </p>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={submitting || getTotalSelectedVotes() === 0 || votingEnded}
              whileHover={!submitting && getTotalSelectedVotes() > 0 && !votingEnded ? { scale: 1.05 } : {}}
              whileTap={!submitting && getTotalSelectedVotes() > 0 && !votingEnded ? { scale: 0.95 } : {}}
              className={`
                relative px-16 py-5 rounded-full font-bold text-lg
                transition-all duration-300 flex items-center gap-3
                ${votingEnded
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : getTotalSelectedVotes() === 0
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:shadow-[0_0_60px_rgba(255,215,0,0.6)]'
                }
              `}
            >
              {!votingEnded && getTotalSelectedVotes() > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] blur-xl opacity-50"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <span className="relative z-10 flex items-center gap-3">
                {votingEnded ? (
                  <><Lock className="w-5 h-5" />Đã hết thời gian</>
                ) : submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Đang gửi...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" />{hasVoted ? 'Cập nhật bình chọn' : 'Xác nhận bình chọn'}</>
                )}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
