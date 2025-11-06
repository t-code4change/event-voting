"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Category } from "@/types/voting"
import { CheckCircle2, TrendingUp } from "lucide-react"
import confetti from "canvas-confetti"

interface CategoryVotingCardProps {
  category: Category
  selectedCandidates: string[]
  onToggleCandidate: (candidateId: string) => void
  showVoteCounts?: boolean
  voteCounts?: Record<string, number>
}

export default function CategoryVotingCard({
  category,
  selectedCandidates,
  onToggleCandidate,
  showVoteCounts = false,
  voteCounts = {},
}: CategoryVotingCardProps) {
  const canSelectMore = selectedCandidates.length < category.max_votes_per_voter
  const isMaxReached = selectedCandidates.length >= category.max_votes_per_voter

  // Calculate vote statistics
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
  const maxVotes = Math.max(...Object.values(voteCounts), 0)

  const getCandidateVotePercentage = (candidateId: string) => {
    const votes = voteCounts[candidateId] || 0
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  }

  const isLeading = (candidateId: string) => {
    return voteCounts[candidateId] === maxVotes && maxVotes > 0
  }

  const handleCandidateClick = (candidateId: string, isCurrentlySelected: boolean, event: React.MouseEvent) => {
    // Trigger confetti on selection (not deselection)
    if (!isCurrentlySelected) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD700', '#FDB931', '#FFE68A', '#8b5cf6', '#ec4899'],
        scalar: 0.8,
        gravity: 1.2,
        ticks: 200,
      })
    }

    onToggleCandidate(candidateId)
  }

  return (
    <Card className="border-2 border-[#FFD700]/30 bg-[#1a1a1a]">
      <CardHeader className="bg-gradient-to-r from-[#FFD700]/10 to-purple-600/10 border-b border-[#FFD700]/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              {category.emoji && <span>{category.emoji}</span>}
              {category.name}
            </CardTitle>
            {category.description && (
              <CardDescription className="mt-2 text-[#FAF3E0]/70">
                {category.description}
              </CardDescription>
            )}
          </div>
          <Badge
            className={`text-sm ${
              isMaxReached
                ? "bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black border-0"
                : "bg-[#1a1a1a] text-[#FAF3E0] border-[#FFD700]/30"
            }`}
          >
            Đã chọn: {selectedCandidates.length}/{category.max_votes_per_voter}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {category.candidates.map((candidate, index) => {
            const isSelected = selectedCandidates.includes(candidate.id)
            const isDisabled = !isSelected && isMaxReached

            return (
              <motion.div
                key={candidate.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={!isDisabled ? { scale: 1.03, y: -4 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card
                  className={`cursor-pointer transition-all relative overflow-hidden min-h-[320px] flex flex-col ${
                    isSelected
                      ? "border-[#FFD700] border-2 bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/30"
                      : isDisabled
                      ? "opacity-50 cursor-not-allowed border-[#FFD700]/10 bg-[#0B0B0B]"
                      : "border-[#FFD700]/20 bg-[#0B0B0B] hover:border-[#FFD700]/60 hover:bg-[#FFD700]/5 hover:shadow-lg hover:shadow-[#FFD700]/20"
                  }`}
                  onClick={(e) => {
                    if (!isDisabled) {
                      handleCandidateClick(candidate.id, isSelected, e)
                    }
                  }}
                >
                  {/* Glow effect on hover */}
                  {!isDisabled && !isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/5 to-[#FFD700]/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute top-2 right-2"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <div className="bg-[#FFD700] rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-black" />
                      </div>
                    </motion.div>
                  )}

                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex flex-col gap-3 h-full">
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Avatar className={`h-20 w-20 border-2 transition-all ${
                            isSelected
                              ? "border-[#FFD700] shadow-lg shadow-[#FFD700]/50"
                              : "border-[#FFD700]/30"
                          }`}>
                            <AvatarImage
                              src={candidate.photo_url || ""}
                              alt={candidate.name}
                              className="object-cover object-center"
                            />
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-[#FFD700]/20 to-purple-600/20 text-[#FFD700]">
                              {candidate.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-base truncate transition-colors ${
                            isSelected ? "text-[#FFD700]" : "text-white"
                          }`}>
                            {candidate.name}
                          </h3>
                          {showVoteCounts && isLeading(candidate.id) && (
                            <Badge className="mt-1 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black text-xs border-0">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Dẫn đầu
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {candidate.description && (
                        <p className="text-sm text-[#FAF3E0]/70 line-clamp-3 leading-relaxed flex-1">
                          {candidate.description}
                        </p>
                      )}

                      {/* Vote Progress Bar */}
                      {showVoteCounts && totalVotes > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#FFE68A]">
                              {voteCounts[candidate.id] || 0} lượt
                            </span>
                            <span className="text-[#FFE68A] font-semibold">
                              {getCandidateVotePercentage(candidate.id)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden border border-[#FFD700]/20">
                            <motion.div
                              className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${getCandidateVotePercentage(candidate.id)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Checkbox */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#FFD700]/10 mt-auto">
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          className="data-[state=checked]:bg-[#FFD700] data-[state=checked]:border-[#FFD700]"
                          onCheckedChange={() => {
                            if (!isDisabled) {
                              onToggleCandidate(candidate.id)
                            }
                          }}
                        />
                        <span className="text-xs text-[#FAF3E0]/60">
                          {isSelected ? "Đã chọn" : "Chọn ứng viên"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {category.candidates.length === 0 && (
          <div className="text-center py-8 text-[#FAF3E0]/70">
            Chưa có ứng viên nào
          </div>
        )}
      </CardContent>
    </Card>
  )
}
