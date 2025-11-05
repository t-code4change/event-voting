"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, TrendingUp, Trophy, Users, Vote, Crown, Sparkles } from "lucide-react"
import AnimatedCounter from "@/components/AnimatedCounter"
import PhotoCarousel from "@/components/PhotoCarousel"
import CountdownTimer from "@/components/CountdownTimer"

export default function ResultsPage() {
  const [isLive] = useState(true)
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

  // Demo data
  const stats = {
    totalVotes: 450,
    totalVoters: 156,
    totalCategories: 3,
    totalCandidates: 16,
  }

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

      {/* Hero Section with Spotlight Effect */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_50%)]" />

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
              <p className="text-sm text-[#FFE68A] mb-3 font-medium">
                ⏰ Thời gian còn lại để bình chọn
              </p>
              <CountdownTimer
                endTime={votingEndTime}
                onTimeUp={() => setVotingEnded(true)}
              />
            </motion.div>

            {isLive && !votingEnded && (
              <Badge className="animate-pulse px-6 py-2 border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] text-sm font-semibold">
                🔴 LIVE UPDATE
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container px-4 py-8 max-w-7xl">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden shadow-2xl shadow-[#FFD700]/10">
              <CardHeader className="bg-gradient-to-r from-[#FFD700]/20 via-[#FFD700]/10 to-purple-600/10 border-b border-[#FFD700]/30 relative overflow-hidden">
                <CardTitle className="text-3xl font-playfair flex items-center gap-3 text-white relative z-10">
                  <Trophy className="h-8 w-8 text-[#FFD700]" />
                  King of the Night
                  <TrendingUp className="h-6 w-6 text-[#FFD700] ml-auto" />
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8">
                <div className="space-y-6">
                  {[
                    { rank: 1, name: "Nguyễn Văn A", department: "Phòng Kinh Doanh", votes: 150, emoji: "🥇", photoUrl: "https://i.pravatar.cc/150?img=12" },
                    { rank: 2, name: "Trần Minh B", department: "Phòng Marketing", votes: 120, emoji: "🥈", photoUrl: "https://i.pravatar.cc/150?img=13" },
                    { rank: 3, name: "Lê Hoàng C", department: "Phòng IT", votes: 90, emoji: "🥉", photoUrl: "https://i.pravatar.cc/150?img=14" },
                    { rank: 4, name: "Phạm Tuấn D", department: "Phòng Nhân Sự", votes: 75, emoji: "", photoUrl: "https://i.pravatar.cc/150?img=15" },
                  ].map((result) => {
                    const percentage = (result.votes / 150) * 100

                    return (
                      <motion.div
                        key={result.rank}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: result.rank * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          relative flex items-center gap-4 p-5 rounded-xl border-2
                          ${getMedalBorderClass(result.rank)}
                          bg-gradient-to-r from-[#0B0B0B] to-[#1a1a1a]
                          hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#0B0B0B]
                          transition-all duration-300
                          ${getMedalGlowClass(result.rank)}
                        `}
                      >
                        <div className="flex-shrink-0">
                          {result.emoji ? (
                            <motion.div
                              className="text-5xl"
                              animate={result.rank === 1 ? { rotate: [0, -10, 10, -10, 0] } : {}}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              {result.emoji}
                            </motion.div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] font-bold text-lg">
                              {result.rank}
                            </div>
                          )}
                        </div>

                        <Avatar className="h-16 w-16 border-3 border-[#FFD700]/50 shadow-lg">
                          <AvatarImage src={result.photoUrl} alt={result.name} />
                          <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-[#FFD700]/30 to-purple-600/30 text-[#FFD700]">
                            {result.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-xl text-white truncate" style={{ textShadow: result.rank <= 3 ? '0 0 10px rgba(255,215,0,0.3)' : '' }}>
                                {result.name}
                              </h3>
                              <p className="text-sm text-[#FFE68A]/80">{result.department}</p>
                            </div>
                            <Badge className="ml-2 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black border-0 font-bold text-base px-4 py-1">
                              <AnimatedCounter value={result.votes} /> phiếu
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: result.rank * 0.2 }}
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
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-pink-500/40 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden shadow-2xl shadow-pink-500/10">
              <CardHeader className="bg-gradient-to-r from-pink-500/20 via-pink-500/10 to-purple-600/10 border-b border-pink-500/30">
                <CardTitle className="text-3xl font-playfair flex items-center gap-3 text-white">
                  <Crown className="h-8 w-8 text-pink-400" />
                  Queen of the Night
                  <TrendingUp className="h-6 w-6 text-pink-400 ml-auto" />
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8">
                <div className="text-center py-12 text-[#FAF3E0]/60">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-pink-400/50" />
                  <p>Kết quả đang được cập nhật...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
            <h2
              className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3"
              style={{ textShadow: '0 0 20px rgba(255,215,0,0.3), 0 2px 6px rgba(0,0,0,0.8)' }}
            >
              Khoảnh khắc đáng nhớ 🌟
            </h2>
            <p className="text-lg text-[#FFE68A]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              20 năm một hành trình rực rỡ
            </p>
          </div>

          <PhotoCarousel />
        </motion.section>
      </div>
    </div>
  )
}
