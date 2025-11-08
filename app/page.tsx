"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MyButton from "@/components/MyButton"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import {
  Sparkles, QrCode, Vote, Gift, BarChart3,
  Users, Star, Trophy, ArrowRight, Search,
  TrendingUp, Crown
} from "lucide-react"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Confetti Component
function Confetti({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#9C27FF' : '#FFFFFF',
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export default function GalaVotePage() {
  const router = useRouter()
  const [showEventSearch, setShowEventSearch] = useState(false)
  const [eventCode, setEventCode] = useState("")
  const [searching, setSearching] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleJoinEvent = async () => {
    if (!eventCode.trim()) {
      alert("Vui lòng nhập mã hoặc tên sự kiện")
      return
    }

    setSearching(true)
    setTimeout(() => {
      router.push(`/event/${eventCode}`)
      setSearching(false)
    }, 800)
  }

  // Trigger confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-hidden">
      <Header />
      <Confetti show={showConfetti} />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]" />
        </div>

        {/* Animated Spotlight Sweep */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Gold Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? '#FFD700' : '#9C27FF',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative container px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Logo/Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Crown className="w-20 h-20 mx-auto text-[#FFD700]" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                      '0 0 40px 20px rgba(255, 215, 0, 0.1)',
                      '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="block text-white mb-3" style={{ textShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
                Trải nghiệm sự kiện
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent" style={{ textShadow: '0 0 50px rgba(255,215,0,0.5)' }}>
                theo cách chuyên nghiệp nhất
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Check-in, Vote, Quay số và tương tác realtime — tất cả trong một nền tảng duy nhất.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MyButton
                  variant="primary"
                  size="large"
                  onClick={() => setShowEventSearch(true)}
                  className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all duration-300 relative overflow-hidden group"
                  icon={<Sparkles className="h-6 w-6" />}
                  iconPosition="left"
                >
                  <span className="flex items-center gap-2">
                    Tham gia sự kiện
                  </span>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </MyButton>
              </motion.div>

              <Link href="/hello">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-300"
                    icon={<Trophy className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Đăng nhập
                  </MyButton>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#FFD700] flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Event Search Modal */}
      <AnimatePresence>
        {showEventSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEventSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="border-2 border-[#FFD700] bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center">
                        <Search className="h-8 w-8 text-black" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Tham gia sự kiện</h2>
                      <p className="text-gray-400">Nhập mã hoặc tên sự kiện để bắt đầu</p>
                    </div>

                    {/* Search Input */}
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Nhập mã sự kiện (VD: ABC123)"
                          value={eventCode}
                          onChange={(e) => setEventCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleJoinEvent()}
                          className="pl-12 h-14 text-lg bg-[#0D0D1A] border-2 border-[#FFD700]/30 focus:border-[#FFD700] text-white rounded-xl"
                          disabled={searching}
                        />
                      </div>

                      <div className="flex gap-3">
                        <MyButton
                          variant="primary"
                          size="large"
                          onClick={handleJoinEvent}
                          disabled={searching || !eventCode.trim()}
                          loading={searching}
                          className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold rounded-xl h-14"
                          icon={<ArrowRight className="h-5 w-5" />}
                          iconPosition="right"
                        >
                          {searching ? "Đang tìm kiếm..." : "Vào sự kiện"}
                        </MyButton>

                        <MyButton
                          variant="outline"
                          size="large"
                          onClick={() => {
                            setShowEventSearch(false)
                            setEventCode("")
                          }}
                          disabled={searching}
                          className="px-6 border-2 border-[#FFD700]/30 hover:bg-[#FFD700]/10 text-[#FFD700] rounded-xl h-14"
                        >
                          Hủy
                        </MyButton>
                      </div>
                    </div>

                    {/* Demo Event Suggestion */}
                    <div className="pt-6 border-t border-[#FFD700]/20">
                      <p className="text-sm text-gray-500 text-center mb-3">Hoặc thử ngay với sự kiện demo:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEventCode("d112584a-4c6e-47fa-a4da-df1e3488d374")}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD700]/20 to-[#FDB931]/20 border border-[#FFD700]/30 hover:border-[#FFD700] transition-colors text-sm text-[#FFD700] font-medium"
                        >
                          Year End Party 2025
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMPACT STATS SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Được tin tưởng bởi <span className="text-[#FFD700]">hàng trăm</span> sự kiện chuyên nghiệp
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group">
                {/* Gold shimmer on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <CardContent className="p-8 text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-5xl font-bold text-[#FFD700]">
                    <AnimatedCounter end={200} suffix="+" />
                  </div>
                  <div className="text-xl font-semibold text-white">Sự kiện thành công</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Từ gala, hội nghị, đến tiệc tri ân – chúng tôi đều có mặt.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-2 border-[#9C27FF]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#9C27FF] transition-all duration-300 group">
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(156,39,255,0.1), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <CardContent className="p-8 text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#9C27FF] to-[#7B1FA2] flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-[#9C27FF]">
                    <AnimatedCounter end={150} suffix="K+" />
                  </div>
                  <div className="text-xl font-semibold text-white">Người tham gia</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Khán giả hào hứng, tương tác tức thì.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group">
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <CardContent className="p-8 text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-black fill-black" />
                  </div>
                  <div className="text-5xl font-bold text-[#FFD700]">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <div className="text-xl font-semibold text-white">Hài lòng</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Được tin tưởng bởi các thương hiệu hàng đầu.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with gold gradient and bokeh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-[#9C27FF]/5 to-[#0D0D1A]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trải nghiệm hoàn chỉnh
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mọi tính năng cho sự kiện thành công.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: QrCode,
                title: "QR Check-in",
                description: "Quét mã trong tích tắc – quản lý khách mời mượt mà.",
                gradient: "from-green-500 to-emerald-600",
                delay: 0.1,
              },
              {
                icon: Vote,
                title: "Live Voting",
                description: "Bình chọn realtime – kết quả hiển thị tức thì.",
                gradient: "from-blue-500 to-blue-600",
                delay: 0.2,
              },
              {
                icon: Gift,
                title: "Lucky Draw",
                description: "Quay số sôi động, hiệu ứng đẳng cấp sân khấu.",
                gradient: "from-[#FFD700] to-[#FDB931]",
                delay: 0.3,
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Báo cáo trực quan – theo dõi hiệu quả từng khoảnh khắc.",
                gradient: "from-purple-500 to-indigo-600",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card className="relative overflow-hidden border-2 border-[#FFD700]/20 bg-[#0D0D1A] hover:border-[#FFD700] transition-all duration-300 group h-full">
                  {/* Gold reflection on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <CardContent className="p-6 space-y-4 relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0D0D1A] to-[#FFD700]" />

        {/* Moving light particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sự kiện không chỉ là chương trình<br />
              <span className="text-[#FFD700]">— đó là trải nghiệm</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300">
              Khởi động hành trình của bạn cùng <strong className="text-[#FFD700]">GalaVote</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/admin/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold shadow-2xl"
                    icon={<TrendingUp className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    <span className="flex items-center gap-2">
                      Tạo sự kiện của bạn
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                    </span>
                  </MyButton>
                </motion.div>
              </Link>

              <Link href="/hello">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#9C27FF] font-semibold"
                  >
                    Tìm hiểu thêm
                  </MyButton>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0D0D1A] border-t border-[#FFD700]/20 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container px-4"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Logo & Slogan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="h-8 w-8 text-[#FFD700]" />
                <span className="text-2xl font-bold text-white">GalaVote</span>
              </div>
              <p className="text-gray-400 italic">Powering every great event.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "Tham gia", onClick: () => setShowEventSearch(true) },
                  { label: "Giới thiệu", href: "/hello" },
                  { label: "Đăng nhập", href: "/admin/login" },
                ].map((link, idx) => (
                  <div key={idx}>
                    {link.href ? (
                      <Link href={link.href}>
                        <span className="text-gray-400 hover:text-[#FFD700] transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={link.onClick}
                        className="text-gray-400 hover:text-[#FFD700] transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>contact@code4change.tech</p>
                <p>quaysotrungthuong.vn</p>
                <div className="flex gap-4 pt-2">
                  {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                    <span
                      key={social}
                      className="hover:text-[#FFD700] transition-colors cursor-pointer text-sm"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#FFD700]/20 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 GalaVote by Code4Change.tech. All rights reserved.
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}
