"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Header from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, TrendingUp, Trophy, Users, Vote, Crown, Sparkles, Loader2, Monitor } from "lucide-react"
import AnimatedCounter from "@/components/AnimatedCounter"
import Link from "next/link"
import PhotoCarousel from "@/components/PhotoCarousel"
import CountdownTimer from "@/components/CountdownTimer"
import ConfettiEffect from "@/components/ConfettiEffect"
import { useRealtimeResults } from "@/hooks/useRealtimeResults"
import { toast } from "@/hooks/use-toast"

export default function ResultsPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [isLive] = useState(true)
  const [votingEnded, setVotingEnded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

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

  // Use realtime results hook
  const { categories, stats, loading, setOnNewVote } = useRealtimeResults(eventId)

  // Set up confetti trigger for new votes
  useEffect(() => {
    setOnNewVote(() => () => {
      setShowConfetti(true)
      toast({
        variant: "success",
        title: "Vote mới! ✨",
        description: "Vote mới vừa được ghi nhận!",
        duration: 3000,
        meta: {
          triggerConfetti: true,
        }
      })
      setTimeout(() => setShowConfetti(false), 3000)
    })
  }, [setOnNewVote])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const getMedalBorderClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-[#FFD700] shadow-lg shadow-[#FFD700]/50"
      case 2:
        return "border-[#C0C0C0] shadow-lg shadow-[#C0C0C0]/30"
      case 3:
        return "border-[#CD7F32] shadow-lg shadow-[#CD7F32]/30"
      default:
        return "border-[#FFD700]/20"
    }
  }

  const getMedalGlowClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-[#FFD700]/20 after:to-transparent after:animate-pulse after:pointer-events-none"
      case 2:
        return "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-[#C0C0C0]/10 after:to-transparent after:animate-pulse after:pointer-events-none"
      case 3:
        return "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-[#CD7F32]/10 after:to-transparent after:animate-pulse after:pointer-events-none"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1E1B13] to-[#0B0B0B]">
      <Header />

      {/* Confetti Effect */}
      <ConfettiEffect show={showConfetti} duration={3000} />

      {/* Hero Section with Spotlight Effect */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-[-1] bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_50%)]" />

        <div className="container px-4 py-12 md:py-16">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Crown className="h-16 w-16 text-[#FFD700] mx-auto mb-4" />
            </motion.div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white"
              style={{ textShadow: '0 0 30px rgba(255,215,0,0.5), 0 2px 8px rgba(0,0,0,0.8)' }}
            >
              KẾT QUẢ BÌNH CHỌN
            </h1>
            <h2
              className="text-2xl md:text-3xl font-playfair font-semibold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent"
              style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}
            >
              KING & QUEEN OF THE NIGHT
            </h2>

            <div className="flex items-center justify-center gap-2 pt-2">
              {isLive && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#FFD700]"
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <p
                className="text-lg text-[#FFE68A] font-medium"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                Cập nhật realtime – vinh danh những ngôi sao tỏa sáng nhất!
              </p>
            </div>

            {/* Countdown Timer */}
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-sm text-[#FFE68A] mb-3 font-medium flex items-center justify-center gap-2">
                <Vote className="w-4 h-4" />
                Thời gian còn lại để bình chọn
              </p>
                <div className="w-full max-w-2xl mx-auto my-6">

              <CountdownTimer
                endTime={votingEndTime}
                onTimeUp={() => setVotingEnded(true)}
              />
                </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4 pt-4">
              {isLive && !votingEnded && (
                <Badge className="animate-pulse px-6 py-2 border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] text-sm font-semibold flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#FFD700]"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  LIVE UPDATE
                </Badge>
              )}

              <Link href={`/app/%5Blocale%5D/event/${eventId}/live`} target="_blank">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black font-semibold rounded-full flex items-center gap-2 shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 transition-all"
                >
                  <Monitor className="w-4 h-4" />
                  Mở giao diện LED
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 py-8 max-w-7xl">
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-[#FFD700]" />
          </div>
        ) : (
          <>
            {/* Stats Overview with Animated Counters */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                { icon: Vote, label: "Tổng phiếu", value: stats.totalVotes, color: "from-[#FFD700] to-[#FDB931]" },
                { icon: Users, label: "Người đã vote", value: stats.totalVoters, color: "from-purple-500 to-pink-500" },
                { icon: Trophy, label: "Danh hiệu", value: stats.totalCategories, color: "from-pink-500 to-rose-500" },
                { icon: Crown, label: "Ứng viên", value: stats.totalCandidates, color: "from-orange-500 to-amber-500" },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="border-2 border-[#FFD700]/20 bg-[#1a1a1a] hover:border-[#FFD700]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/20 group">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[#FAF3E0]/70 font-medium mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                          <AnimatedCounter value={stat.value} duration={2} />
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Results by Category */}
            <div className="space-y-12">
              {categories.length === 0 ? (
                <Card className="border-2 border-[#FFD700]/20 bg-[#1a1a1a]">
                  <CardContent className="p-12 text-center space-y-4">
                    <Sparkles className="h-12 w-12 mx-auto text-[#FFD700]/50" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">
                        Chưa có kết quả
                      </h3>
                      <p className="text-[#FAF3E0]/70">
                        Các kết quả sẽ hiển thị khi có vote
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                categories.map((category) => {
                  const maxVotes = Math.max(...category.candidates.map(c => c.vote_count), 1)
                  const getCategoryColor = (categoryName: string) => {
                    if (categoryName.toLowerCase().includes('king')) {
                      return {
                        border: 'border-[#FFD700]/40',
                        shadow: 'shadow-[#FFD700]/10',
                        gradient: 'from-[#FFD700]/20 via-[#FFD700]/10 to-purple-600/10',
                        iconColor: 'text-[#FFD700]',
                      }
                    } else if (categoryName.toLowerCase().includes('queen')) {
                      return {
                        border: 'border-pink-500/40',
                        shadow: 'shadow-pink-500/10',
                        gradient: 'from-pink-500/20 via-pink-500/10 to-purple-600/10',
                        iconColor: 'text-pink-400',
                      }
                    } else {
                      return {
                        border: 'border-purple-500/40',
                        shadow: 'shadow-purple-500/10',
                        gradient: 'from-purple-500/20 via-purple-500/10 to-pink-600/10',
                        iconColor: 'text-purple-400',
                      }
                    }
                  }

                  const colors = getCategoryColor(category.name)

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className={`border-2 ${colors.border} bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden shadow-2xl ${colors.shadow}`}>
                        <CardHeader className={`bg-gradient-to-r ${colors.gradient} border-b ${colors.border} relative overflow-hidden`}>
                          <CardTitle className="text-3xl font-playfair flex items-center gap-3 text-white relative z-10">
                            <Crown className={`h-8 w-8 ${colors.iconColor}`} />
                            {category.name}
                            <TrendingUp className={`h-6 w-6 ${colors.iconColor} ml-auto`} />
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-8">
                          {category.candidates.length === 0 ? (
                            <div className="text-center py-12 text-[#FAF3E0]/60">
                              <Sparkles className={`h-12 w-12 mx-auto mb-4 ${colors.iconColor}/50`} />
                              <p>Chưa có ứng viên</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {category.candidates.map((candidate) => {
                                const percentage = maxVotes > 0 ? (candidate.vote_count / maxVotes) * 100 : 0
                                const getRankBadge = (rank: number) => {
                                  switch (rank) {
                                    case 1:
                                      return (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center shadow-lg shadow-[#FFD700]/50">
                                          <Trophy className="w-7 h-7 text-black" />
                                        </div>
                                      )
                                    case 2:
                                      return (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] flex items-center justify-center shadow-lg shadow-[#C0C0C0]/30">
                                          <Trophy className="w-7 h-7 text-white" />
                                        </div>
                                      )
                                    case 3:
                                      return (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#B8733A] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30">
                                          <Trophy className="w-7 h-7 text-white" />
                                        </div>
                                      )
                                    default:
                                      return (
                                        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] font-bold text-lg">
                                          {rank}
                                        </div>
                                      )
                                  }
                                }

                                return (
                                  <motion.div
                                    key={candidate.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: candidate.rank * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`
                                      relative flex items-center gap-4 p-5 rounded-xl border-2
                                      ${getMedalBorderClass(candidate.rank)}
                                      bg-gradient-to-r from-[#0B0B0B] to-[#1a1a1a]
                                      hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#0B0B0B]
                                      transition-all duration-300
                                      ${getMedalGlowClass(candidate.rank)}
                                    `}
                                  >
                                    <motion.div
                                      className="flex-shrink-0"
                                      animate={candidate.rank === 1 ? { scale: [1, 1.1, 1] } : {}}
                                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                      {getRankBadge(candidate.rank)}
                                    </motion.div>

                                    <Avatar className="h-16 w-16 border-3 border-[#FFD700]/50 shadow-lg">
                                      <AvatarImage
                                        src={candidate.photo_url || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`}
                                        alt={candidate.name}
                                      />
                                      <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-[#FFD700]/30 to-purple-600/30 text-[#FFD700]">
                                        {candidate.name.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <div>
                                          <h3 className="font-bold text-xl text-white truncate" style={{ textShadow: candidate.rank <= 3 ? '0 0 10px rgba(255,215,0,0.3)' : '' }}>
                                            {candidate.name}
                                          </h3>
                                          <p className="text-sm text-[#FFE68A]/80">{candidate.description}</p>
                                        </div>
                                        <Badge className="ml-2 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black border-0 font-bold text-base px-4 py-1">
                                          <AnimatedCounter value={candidate.vote_count} /> phiếu
                                        </Badge>
                                      </div>

                                      <div className="space-y-1">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          whileInView={{ width: "100%" }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 1, delay: candidate.rank * 0.2 }}
                                        >
                                          <Progress
                                            value={percentage}
                                            className="h-3 bg-[#1a1a1a]"
                                          />
                                        </motion.div>
                                        <p className="text-xs text-[#FAF3E0]/60">
                                          {percentage.toFixed(1)}%
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Company Photo Carousel */}
            <motion.section
              className="mt-20 mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Sparkles className="w-8 h-8 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }} />
                  <h2
                    className="text-3xl md:text-4xl font-playfair font-bold text-white"
                    style={{ textShadow: '0 0 20px rgba(255,215,0,0.3), 0 2px 6px rgba(0,0,0,0.8)' }}
                  >
                    Khoảnh khắc đáng nhớ
                  </h2>
                  <Sparkles className="w-8 h-8 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }} />
                </div>
                <p className="text-lg text-[#FFE68A]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  20 năm một hành trình rực rỡ
                </p>
              </div>

              <PhotoCarousel />
            </motion.section>
          </>
        )}
      </div>
    </div>
  )
}
