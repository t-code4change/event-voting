"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Header from "@/components/Header"
import AuthModal from "@/components/AuthModal"
import { CheckCircle2, Loader2, Lock, Crown, Sparkles, Smile, Palette, Check, Eye } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"
import { Category, VotesByCategory, Candidate } from "@/types/voting"
import { useRealtimeVotes } from "@/hooks/useRealtimeVotes"
import Link from "next/link"

// Category icon mapping
const categoryIcons: Record<string, any> = {
  King: Crown,
  Queen: Crown,
  Smile: Smile,
  Creative: Palette,
}

// Get icon for category
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
        {/* Spotlight glow effect */}
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
            src={candidate.photo_url || ""}
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
            {candidate.description}
          </p>

          {/* Select Button */}
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

// LED Countdown Timer Component
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
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  const pad = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-[#FFD700]/20 to-purple-600/20 blur-xl" />

      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-6 border border-white/10">
        <p className="text-center text-[#FFD700] text-sm font-semibold mb-3 tracking-wide uppercase">
          Thời gian còn lại
        </p>

        <div className="flex items-center justify-center gap-2">
          {/* Hours */}
          <div className="flex gap-1">
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.hours)[0]}
              </span>
            </div>
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.hours)[1]}
              </span>
            </div>
          </div>

          <span className="text-[#FFD700] text-2xl font-bold">:</span>

          {/* Minutes */}
          <div className="flex gap-1">
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.minutes)[0]}
              </span>
            </div>
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.minutes)[1]}
              </span>
            </div>
          </div>

          <span className="text-[#FFD700] text-2xl font-bold">:</span>

          {/* Seconds */}
          <div className="flex gap-1">
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.seconds)[0]}
              </span>
            </div>
            <div className="w-14 h-16 bg-black/50 rounded-lg border border-[#FFD700]/30 flex items-center justify-center">
              <span className="text-[#FFD700] text-3xl font-bold font-mono tabular-nums" style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}>
                {pad(timeLeft.seconds)[1]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-2">
          <span className="text-white/40 text-xs uppercase tracking-wider">Giờ</span>
          <span className="text-white/40 text-xs uppercase tracking-wider">Phút</span>
          <span className="text-white/40 text-xs uppercase tracking-wider">Giây</span>
        </div>
      </div>
    </div>
  )
}

// Main Voting Page
export default function VotingPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [voterId, setVoterId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedVotes, setSelectedVotes] = useState<VotesByCategory>({})
  const [eventName, setEventName] = useState<string>("")
  const [votingEnded, setVotingEnded] = useState(false)
  const [hasVotedBefore, setHasVotedBefore] = useState(false)

  // Realtime vote counts
  const { voteCounts } = useRealtimeVotes(eventId)

  // Demo voting end time: 21:00 today
  const votingEndTime = useMemo(() => {
    const end = new Date()
    end.setHours(21, 0, 0, 0)
    if (end.getTime() < Date.now()) {
      end.setDate(end.getDate() + 1)
    }
    return end
  }, [])

  useEffect(() => {
    if (eventId) {
      loadCategories()
    }
  }, [eventId])

  const loadCategories = async () => {
    if (!eventId) return

    setLoading(true)
    try {
      const categoriesResponse = await fetch(`/api/events/${eventId}/categories`)
      if (!categoriesResponse.ok) {
        throw new Error("Failed to load categories")
      }
      const categoriesData = await categoriesResponse.json()

      const categoriesWithAvatars = (categoriesData.categories || []).map((cat: any) => ({
        ...cat,
        candidates: cat.candidates.map((candidate: any) => ({
          ...candidate,
          photo_url: candidate.photo_url || `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70) + 1}`
        }))
      }))

      setCategories(categoriesWithAvatars)
      setEventName(categoriesData.eventName || "")
    } catch (error) {
      console.error("Error loading categories:", error)
      showErrorToast("Không thể tải dữ liệu sự kiện", {
        description: "Vui lòng thử lại sau"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = async (id: string) => {
    setVoterId(id)
    setIsAuthenticated(true)
    setShowAuthModal(false)

    try {
      const votesResponse = await fetch(`/api/votes/voter/${id}`)
      if (votesResponse.ok) {
        const votesData = await votesResponse.json()
        const hasExistingVotes = votesData.votes && Object.keys(votesData.votes).length > 0
        setHasVotedBefore(hasExistingVotes)
        setSelectedVotes((prev) => ({
          ...votesData.votes,
          ...prev,
        }))
      }
    } catch (error) {
      console.error("Error loading existing votes:", error)
    }

    await submitVotes(id)
  }

  const toggleCandidate = (categoryId: string, candidateId: string) => {
    if (votingEnded) {
      showErrorToast("Đã kết thúc", {
        description: "Thời gian bình chọn đã kết thúc"
      })
      return
    }

    setSelectedVotes((prev) => {
      const categoryVotes = prev[categoryId] || []
      const isSelected = categoryVotes.includes(candidateId)

      if (isSelected) {
        return {
          ...prev,
          [categoryId]: categoryVotes.filter((id) => id !== candidateId),
        }
      } else {
        return {
          ...prev,
          [categoryId]: [...categoryVotes, candidateId],
        }
      }
    })
  }

  const handleSubmit = async () => {
    if (votingEnded) {
      showErrorToast("Đã kết thúc", {
        description: "Thời gian bình chọn đã kết thúc"
      })
      return
    }

    const hasVotes = Object.values(selectedVotes).some(
      (votes) => votes.length > 0
    )

    if (!hasVotes) {
      showErrorToast("Chưa chọn ứng viên", {
        description: "Vui lòng chọn ít nhất một ứng viên"
      })
      return
    }

    if (!isAuthenticated || !voterId) {
      setShowAuthModal(true)
      return
    }

    await submitVotes(voterId)
  }

  const submitVotes = async (voterIdParam: string) => {
    setSubmitting(true)

    try {
      const votes = Object.entries(selectedVotes)
        .filter(([_, candidateIds]) => candidateIds.length > 0)
        .map(([categoryId, candidateIds]) => ({
          category_id: categoryId,
          candidate_ids: candidateIds,
        }))

      const response = await fetch("/api/votes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id: voterIdParam,
          event_id: eventId,
          votes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gửi bình chọn thất bại")
      }

      // Use premium GLOW UP 2025 toast with confetti control
      // Only trigger confetti for NEW votes, not updates
      const isUpdate = hasVotedBefore

      if (isUpdate) {
        showSuccessToast("Đã cập nhật bình chọn!", {
          description: "Bình chọn của bạn đã được cập nhật thành công"
        })
      } else {
        showSuccessToast("🎉 Bình chọn thành công!", {
          description: "Cảm ơn bạn đã tham gia bình chọn!",
          confetti: true
        })
      }

      // Mark as voted for future submissions
      setHasVotedBefore(true)
    } catch (error) {
      console.error("Error submitting votes:", error)
      showErrorToast("Lỗi", {
        description: error instanceof Error ? error.message : "Có lỗi xảy ra"
      })
    } finally{
      setSubmitting(false)
    }
  }

  const getTotalSelectedVotes = () => {
    return Object.values(selectedVotes).reduce(
      (sum, votes) => sum + votes.length,
      0
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Purple spotlight left */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gold spotlight right */}
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Purple spotlight bottom */}
        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[110px]"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <Header />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
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
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <CountdownDisplay
            endTime={votingEndTime}
            onTimeUp={() => {
              setVotingEnded(true)
              showErrorToast("Hết giờ!", {
                description: "Thời gian bình chọn đã kết thúc!"
              })
            }}
          />
        </motion.div>

        {/* Results Link */}
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

        {/* Auth Modal */}
        {eventId && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
            eventId={eventId}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#FFD700]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="max-w-md mx-auto bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Chưa có danh mục nào
            </h2>
            <p className="text-white/60">
              Sự kiện này chưa có danh mục bình chọn
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Voting Ended Banner */}
            {votingEnded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
                  <Lock className="w-5 h-5" />
                  Đã hết thời gian bình chọn
                </div>
              </motion.div>
            )}

            {/* Categories */}
            {categories.map((category, categoryIndex) => {
              const Icon = getCategoryIcon(category.name)

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="relative"
                >
                  {/* Category Header */}
                  <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
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

                    {category.max_votes_per_voter && (
                      <p className="text-[#FFD700] text-sm mt-2">
                        Chọn tối đa {category.max_votes_per_voter} ứng viên
                      </p>
                    )}

                    {/* Glow line */}
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
                  Tổng số phiếu đã chọn: <span className="text-[#FFD700] font-bold text-xl">{getTotalSelectedVotes()}</span>
                </p>
                {!isAuthenticated && getTotalSelectedVotes() > 0 && !votingEnded && (
                  <p className="text-purple-400 text-sm flex items-center gap-1 justify-center">
                    <Sparkles className="w-4 h-4" />
                    Bạn sẽ cần xác thực để gửi bình chọn
                  </p>
                )}
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
                {/* Glow effect */}
                {!votingEnded && getTotalSelectedVotes() > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] blur-xl opacity-50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-3">
                  {votingEnded ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Đã hết thời gian
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang gửi...
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Xác thực & Gửi bình chọn
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Xác nhận bình chọn
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
