"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/Header"
import { Vote, Trophy, Clock, Sparkles, ArrowRight, Crown, Users, BarChart3 } from "lucide-react"

interface Stats {
  totalVoters: number
  totalCategories: number
  totalVotes: number
  timeRemaining: number | null
}

interface Candidate {
  id: string
  name: string
  photo_url: string | null
  description: string | null
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalVoters: 0,
    totalCategories: 0,
    totalVotes: 0,
    timeRemaining: null,
  })
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]">
      <Header />

      {/* Hero Section - Luxury Gala */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070')",
          }}
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B]/95 via-[#0B0B0B]/85 to-[#1F1B13]/90" />

        {/* Gold gradient overlay for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-purple-600/10" />

        {/* Enhanced Sparkle effects - more particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FDB931' : '#FFFFFF',
                boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)',
              }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.2, 1, 0],
                y: [0, -30, -60, -100],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="container relative px-4 py-24 md:py-32">
          <motion.div
            className="mx-auto max-w-5xl text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Event Badge */}
            <motion.div variants={fadeIn}>
              <Badge
                variant="outline"
                className="px-6 py-2 text-sm font-medium border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10"
              >
                <Crown className="mr-2 h-4 w-4 inline" />
                Sự kiện bình chọn đặc biệt
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={fadeIn} className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold tracking-tight">
                <span className="block text-white mb-3 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]" style={{ textShadow: '0 0 20px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)' }}>
                  GALA 20 NĂM
                </span>
                <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent animate-shimmer drop-shadow-[0_0_40px_rgba(255,215,0,0.6)]" style={{ textShadow: '0 0 30px rgba(255,215,0,0.8)' }}>
                  KING & QUEEN
                </span>
                <span className="block text-white mt-3 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]" style={{ textShadow: '0 0 20px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)' }}>
                  OF THE NIGHT
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[#FFE68A] font-light max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 10px rgba(255,230,138,0.3)' }}>
                Tỏa sáng cùng đêm tiệc – nơi vinh danh những ngôi sao rực rỡ nhất!
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold shadow-lg hover:shadow-[#FFD700]/50 transition-all duration-300 group"
              >
                <Link href="/vote">
                  <Vote className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  BẮT ĐẦU BÌNH CHỌN
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-full border-2 border-[#FAF3E0]  hover:bg-[#FAF3E0] hover:text-black transition-all duration-300"
              >
                <Link href="/results">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  XEM KẾT QUẢ TRỰC TIẾP
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                label: "Thời gian còn lại",
                value: stats.timeRemaining ? "Đang diễn ra" : "--:--",
                color: "from-[#FFD700] to-[#FDB931]",
              },
              {
                icon: Users,
                label: "Người đã vote",
                value: stats.totalVoters,
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Trophy,
                label: "Danh hiệu",
                value: stats.totalCategories,
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Vote,
                label: "Tổng phiếu",
                value: stats.totalVotes,
                color: "from-orange-500 to-amber-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
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
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Event Introduction */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[#FFD700]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30">
                    <Sparkles className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-sm font-medium text-[#FFD700]">
                      Sự kiện đặc biệt
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3), 0 2px 6px rgba(0,0,0,0.8)' }}>
                    Đêm Gala Sinh nhật 20 năm
                  </h2>
                  <p className="text-lg text-[#FFE68A] leading-relaxed font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    Nơi toàn thể thành viên cùng nhìn lại hành trình rực rỡ.
                    Không chỉ là kỷ niệm, đây còn là sân khấu để mỗi cá nhân tỏa sáng —
                    và cùng bình chọn cho <strong className="text-[#FFD700]" style={{ textShadow: '0 0 10px rgba(255,215,0,0.6)' }}>King & Queen of the Night</strong>!
                  </p>
                  <div className="pt-4">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold"
                    >
                      <Link href="/vote">
                        Tham gia bình chọn ngay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-purple-600/20 flex items-center justify-center">
                    <Crown className="h-32 w-32 text-[#FFD700]/30" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700]/30" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#1F1B13]/90 via-[#2A1E0F]/80 to-[#1F1B13]/90 relative overflow-hidden shadow-2xl shadow-[#FFD700]/20">
            {/* Enhanced Sparkle background */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: i % 2 === 0 ? '#FFD700' : '#FDB931',
                    boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
                  }}
                  animate={{
                    opacity: [0, 1, 0.5, 0],
                    scale: [0, 1.8, 1, 0],
                    y: [0, -20],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                  }}
                />
              ))}
            </div>

            <CardContent className="p-12 text-center space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.4), 0 2px 8px rgba(0,0,0,0.8)' }}>
                Hãy để mỗi lá phiếu của bạn<br />
                là một ánh sáng trong đêm hội!
              </h2>
              <p className="text-lg text-[#FFE68A] max-w-2xl mx-auto font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 0 8px rgba(255,230,138,0.2)' }}>
                Bình chọn ngay để ủng hộ ứng viên yêu thích và cùng tạo nên một đêm gala đáng nhớ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold shadow-lg"
                >
                  <Link href="/vote">
                    <Vote className="mr-2 h-5 w-5" />
                    Tiếp tục bình chọn
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full border-2   hover:bg-[#FAF3E0] hover:text-black"
                >
                  <Link href="/results">Xem kết quả</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#FFD700]/30 mt-16 bg-[#0B0B0B]">
        {/* Subtle gold top border glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />

        <div className="container px-4 py-12">
          <div className="text-center space-y-6">
            {/* Logo & Brand */}
            <div className="flex items-center justify-center gap-2 group">
              <Crown className="h-6 w-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
              <span className="text-xl font-playfair font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                Event Voting System
              </span>
            </div>

            {/* Main branding */}
            <div className="space-y-2">
              <p className="text-sm text-[#FFE68A] font-medium">
                © 2025 Code4Change.tech – QuaySoTrungThuong.vn
              </p>
              <p className="text-sm text-[#FAF3E0]/60">
                Gala 20 năm – King & Queen of the Night
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex items-center justify-center gap-4 text-xs text-[#C6B68C]">
              <span className="hover:text-[#FFD700] transition-colors cursor-default">
                Powered by Next.js & Supabase
              </span>
            </div>

            {/* Divider */}
            <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

            {/* Additional info */}
            <p className="text-xs text-[#FAF3E0]/40">
              Hệ thống bình chọn hiện đại, minh bạch và bảo mật
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
