"use client"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/Header"
import AuthModal from "@/components/AuthModal"
import CategoryVotingCard from "@/components/CategoryVotingCard"
import ConfettiEffect from "@/components/ConfettiEffect"
import CountdownTimer from "@/components/CountdownTimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Category, VotesByCategory } from "@/types/voting"

export default function VotingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [voterId, setVoterId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedVotes, setSelectedVotes] = useState<VotesByCategory>({})
  const [eventId, setEventId] = useState<string | null>(null)
  const [eventName, setEventName] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [votingEnded, setVotingEnded] = useState(false)

  // Demo voting end time: 21:00 today
  const votingEndTime = useMemo(() => {
    const end = new Date()
    end.setHours(21, 0, 0, 0)
    // If it's already past 21:00 today, set to 21:00 tomorrow
    if (end.getTime() < Date.now()) {
      end.setDate(end.getDate() + 1)
    }
    return end
  }, [])

  useEffect(() => {
    loadActiveEvent()
  }, [])

  useEffect(() => {
    if (eventId) {
      loadCategories()
    }
  }, [eventId])

  const loadActiveEvent = async () => {
    try {
      const response = await fetch("/api/events/active")
      if (response.ok) {
        const data = await response.json()
        setEventId(data.event.id)
        setEventName(data.event.name)
      } else {
        console.log("Event not found - using demo mode")
        // Không hiển thị error cho user, chỉ log
      }
    } catch (error) {
      console.error("Error loading active event:", error)
      // Không hiển thị error cho user, chỉ log
    }
  }

  const loadCategories = async () => {
    if (!eventId) return

    setLoading(true)
    try {
      const categoriesResponse = await fetch(`/api/events/${eventId}/categories`)
      if (!categoriesResponse.ok) {
        throw new Error("Failed to load categories")
      }
      const categoriesData = await categoriesResponse.json()

      // Thêm random avatar nếu không có ảnh
      const categoriesWithAvatars = (categoriesData.categories || []).map((cat: any) => ({
        ...cat,
        candidates: cat.candidates.map((candidate: any) => ({
          ...candidate,
          photo_url: candidate.photo_url || `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70) + 1}`
        }))
      }))

      setCategories(categoriesWithAvatars)
    } catch (error) {
      console.error("Error loading categories:", error)
      // Không hiển thị error cho user, chỉ log
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = async (id: string) => {
    setVoterId(id)
    setIsAuthenticated(true)
    setShowAuthModal(false)

    // Load existing votes if any
    try {
      const votesResponse = await fetch(`/api/votes/voter/${id}`)
      if (votesResponse.ok) {
        const votesData = await votesResponse.json()
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
      toast.error("Thời gian bình chọn đã kết thúc")
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
      toast.error("Thời gian bình chọn đã kết thúc")
      return
    }

    const hasVotes = Object.values(selectedVotes).some(
      (votes) => votes.length > 0
    )

    if (!hasVotes) {
      toast.error("Vui lòng chọn ít nhất một ứng viên")
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

      toast.success("Bình chọn của bạn đã được ghi nhận!")
      setShowConfetti(true)
    } catch (error) {
      console.error("Error submitting votes:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]">
      <Header />

      <ConfettiEffect show={showConfetti} duration={5000} />

      <div className="container px-4 py-8 max-w-6xl">
        {/* Header with Countdown */}
        <div className="mb-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Bình chọn
              </h1>
              <p className="text-[#FAF3E0]/70">
                Chọn ứng viên yêu thích của bạn
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="w-full max-w-2xl">
              <CountdownTimer
                endTime={votingEndTime}
                onTimeUp={() => {
                  setVotingEnded(true)
                  toast.error("Thời gian bình chọn đã kết thúc!")
                }}
              />
            </div>
          </div>
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
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-[#FFD700]" />
          </div>
        ) : categories.length === 0 ? (
          <Card className="max-w-2xl mx-auto border-2 border-[#FFD700]/20 bg-[#1a1a1a]">
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Chưa có danh mục nào
              </h2>
              <p className="text-[#FAF3E0]/70">
                Sự kiện này chưa có danh mục bình chọn
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {votingEnded && (
              <Badge variant="destructive" className="w-full justify-center py-3 text-base">
                <Lock className="mr-2 h-5 w-5" />
                Đã hết thời gian bình chọn
              </Badge>
            )}

            {categories.map((category) => (
              <CategoryVotingCard
                key={category.id}
                category={category}
                selectedCandidates={selectedVotes[category.id] || []}
                onToggleCandidate={(candidateId) =>
                  toggleCandidate(category.id, candidateId)
                }
              />
            ))}

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-[#FAF3E0]/70 mb-2">
                  Tổng số phiếu đã chọn: {getTotalSelectedVotes()}
                </p>
                {!isAuthenticated && getTotalSelectedVotes() > 0 && !votingEnded && (
                  <p className="text-xs text-[#FFE68A] mt-1">
                    💡 Bạn sẽ cần đăng nhập để gửi bình chọn
                  </p>
                )}
              </div>
              <Button
                size="lg"
                className="px-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold shadow-lg hover:shadow-[#FFD700]/50 transition-all duration-300"
                disabled={submitting || getTotalSelectedVotes() === 0 || votingEnded}
                onClick={handleSubmit}
              >
                {votingEnded ? (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Đã hết thời gian
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {!isAuthenticated ? "Đăng nhập & Gửi bình chọn" : "Xác nhận bình chọn"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
