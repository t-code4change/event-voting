"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Header from "@/components/Header"
import {
  Vote, Trophy, Sparkles, ArrowRight, Crown, Users, BarChart3,
  Zap, Lock, Palette, FileText, Smartphone, Building2,
  GraduationCap, PartyPopper, Star, ChevronRight, QrCode,
  Gift, TrendingUp, CheckCircle, Scan, Award
} from "lucide-react"

// Counter component for animated numbers
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
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

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function LandingPage() {
  const [currentTheme, setCurrentTheme] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const themes = [
    {
      name: "Gold Gala Night",
      description: "Sang trọng, lịch lãm cho Year-end Party & Awards Ceremony",
      gradient: "from-[#FFD700] via-[#FDB931] to-[#FF9E00]",
      bg: "from-[#1F1B13] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", // Elegant gala dinner
      category: "Gala / Awards",
      features: ["✨ Màn hình LED sang trọng", "🎭 Lighting hiệu ứng sân khấu", "🥂 Không gian VIP"],
    },
    {
      name: "Corporate Blue",
      description: "Chuyên nghiệp, hiện đại cho sự kiện doanh nghiệp",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bg: "from-[#0B1929] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80", // Corporate conference
      category: "Corporate",
      features: ["💼 Dashboard analytics", "📊 Real-time reporting", "🎯 Brand customization"],
    },
    {
      name: "Festival Neon",
      description: "Sôi động, đầy màu sắc cho Team Building & Music Festival",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      bg: "from-[#1a0B29] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", // Festival crowd
      category: "Festival / Team Building",
      features: ["🎉 Hiệu ứng confetti động", "🎵 Sync với nhạc", "🌈 Đa màu sắc"],
    },
    {
      name: "Wedding Elegance",
      description: "Lãng mạn, tinh tế cho tiệc cưới & engagement party",
      gradient: "from-rose-400 via-pink-300 to-purple-400",
      bg: "from-[#2D1B1F] to-[#0B0B0B]",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2a6?w=1200&q=80", // Wedding reception
      category: "Wedding",
      features: ["💕 Romantic theme", "📸 Photo booth voting", "🎊 Guest interaction"],
    },
  ]

  const testimonials = [
    {
      quote: "Từ check-in đến quay số trúng thưởng, mọi thứ đều mượt mà. Khách mời rất thích tính năng QR scan!",
      author: "Lan Anh Nguyễn",
      role: "HR Manager",
      company: "ABC Group",
      avatar: "LA",
    },
    {
      quote: "Giao diện realtime trên màn hình LED tạo cảm giác kịch tính. Đêm gala 500 người chưa bao giờ sôi động đến vậy!",
      author: "Huy Nguyễn",
      role: "Event Organizer",
      company: "Premium Events",
      avatar: "HN",
    },
    {
      quote: "Chúng tôi đã dùng cho 3 sự kiện. Tính năng lucky draw khiến mọi người hào hứng đến phút cuối!",
      author: "Minh Tâm",
      role: "Marketing Director",
      company: "Tech Startup XYZ",
      avatar: "MT",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % themes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

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

      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]" />

        {/* Moving light beams */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-full w-1 bg-gradient-to-b from-transparent via-[#FFD700]/20 to-transparent"
              style={{ left: `${20 * i}%` }}
              animate={{
                x: [0, 100, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-purple-600/10" />

        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FDB931' : '#FFFFFF',
                boxShadow: '0 0 6px rgba(255, 215, 0, 0.9)',
              }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.5, 1, 0],
                y: [0, -40, -80, -120],
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
            className="mx-auto max-w-6xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="space-y-8 text-center lg:text-left">
                <motion.div variants={fadeIn}>
                  <Badge
                    variant="outline"
                    className="px-6 py-2 text-sm font-medium border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10 inline-flex items-center"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Nền tảng tương tác sự kiện toàn diện
                  </Badge>
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold tracking-tight">
                    <span className="block text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
                      Từ Check-in
                    </span>
                    <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9E00] bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(255,215,0,0.6)' }}>
                      đến Gala
                    </span>
                    <span className="block text-white mt-2" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
                      — Tất cả trong một
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-[#FFE68A] leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    <strong className="text-[#FFD700]">Scan – Vote – Win.</strong> Chỉ với một cú quét QR, khách mời có thể check-in, bình chọn, tham gia quay số trúng thưởng và theo dõi kết quả realtime.
                  </p>

                  {/* Interactive features with progress indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    {[
                      {
                        icon: QrCode,
                        text: "QR Check-in",
                        progress: 95,
                        label: "Dùng trong 190+ sự kiện",
                        color: "from-green-500 to-emerald-600",
                        delay: 0.8
                      },
                      {
                        icon: Vote,
                        text: "Live Voting",
                        progress: 98,
                        label: "150K+ lượt vote",
                        color: "from-[#FFD700] to-[#FF9E00]",
                        delay: 0.9
                      },
                      {
                        icon: Gift,
                        text: "Lucky Draw",
                        progress: 85,
                        label: "Cao trào vui nhộn",
                        color: "from-pink-500 to-rose-600",
                        delay: 1.0
                      },
                      {
                        icon: BarChart3,
                        text: "Realtime Stats",
                        progress: 100,
                        label: "Cập nhật tức thì",
                        color: "from-purple-500 to-indigo-600",
                        delay: 1.1
                      },
                    ].map((item, index) => {
                      const [isHovered, setIsHovered] = useState(false)

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: item.delay, duration: 0.6 }}
                          onHoverStart={() => setIsHovered(true)}
                          onHoverEnd={() => setIsHovered(false)}
                          whileHover={{ scale: 1.02 }}
                          className="relative group cursor-pointer"
                        >
                          <div className="p-4 rounded-2xl bg-[#121212] border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-300 space-y-3">
                            {/* Header with icon and text */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}
                                  animate={isHovered ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                  } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  <item.icon className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                  <p className="font-semibold text-white text-sm">{item.text}</p>
                                  <motion.p
                                    className="text-xs text-[#FAF3E0]/60"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {item.label}
                                  </motion.p>
                                </div>
                              </div>

                              <motion.div
                                className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#FF9E00] bg-clip-text text-transparent"
                                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                              >
                                {item.progress}%
                              </motion.div>
                            </div>

                            {/* Animated progress bar */}
                            <div className="relative h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                              {/* Background glow */}
                              <motion.div
                                className="absolute inset-0 opacity-30"
                                animate={isHovered ? {
                                  boxShadow: [
                                    '0 0 10px rgba(255, 215, 0, 0.3)',
                                    '0 0 20px rgba(255, 215, 0, 0.6)',
                                    '0 0 10px rgba(255, 215, 0, 0.3)',
                                  ]
                                } : {}}
                                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                              />

                              {/* Progress fill */}
                              <motion.div
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{
                                  delay: item.delay + 0.3,
                                  duration: 1.2,
                                  ease: "easeOut"
                                }}
                                style={{
                                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                                }}
                              >
                                {/* Animated shimmer effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{
                                    x: ['-100%', '200%']
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: item.delay + 1.5
                                  }}
                                />
                              </motion.div>

                              {/* Hover pulse effect */}
                              {isHovered && (
                                <motion.div
                                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full`}
                                  initial={{ width: `${item.progress}%`, opacity: 0.5 }}
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity
                                  }}
                                />
                              )}
                            </div>

                            {/* Confetti effect on hover */}
                            {isHovered && (
                              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                                {[...Array(6)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1.5 h-1.5 rounded-full"
                                    style={{
                                      background: ['#FFD700', '#FF9E00', '#FDB931'][i % 3],
                                      left: `${20 + i * 15}%`,
                                      top: '50%',
                                    }}
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{
                                      opacity: [0, 1, 0],
                                      y: [-20, -40],
                                      x: [0, (i % 2 === 0 ? 10 : -10)],
                                      rotate: [0, 360]
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: i * 0.05,
                                      repeat: Infinity,
                                      repeatDelay: 1
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-semibold shadow-lg hover:shadow-[#FFD700]/60 transition-all duration-300 group relative overflow-hidden"
                  >
                    <Link href="/vote">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="relative flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Xem Demo Ngay
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 rounded-full border-2 border-[#FAF3E0]  hover:bg-[#FAF3E0] hover:text-black transition-all duration-300"
                  >
                    <Link href="/pricing">
                      <Trophy className="mr-2 h-5 w-5" />
                      Xem Bảng Giá
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right side - Visual mockup */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Glowing effect behind */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/30 to-purple-600/30 blur-3xl" />

                  {/* Main card showing features */}
                  <Card className="relative border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a]/90 to-[#0B0B0B]/90 backdrop-blur">
                    <CardContent className="p-8 space-y-6">
                      {[
                        { icon: Scan, label: "QR Check-in", color: "from-green-500 to-emerald-600" },
                        { icon: Vote, label: "Live Voting", color: "from-[#FFD700] to-[#FDB931]" },
                        { icon: Gift, label: "Lucky Draw", color: "from-pink-500 to-rose-600" },
                        { icon: Trophy, label: "Results", color: "from-purple-500 to-indigo-600" },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-[#0B0B0B]/50 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all"
                        >
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{feature.label}</p>
                            <div className="h-1 bg-[#FFD700]/20 rounded-full mt-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FDB931]"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.7 + index * 0.2, duration: 1 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Floating confetti */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: ['#FFD700', '#FDB931', '#FF9E00', '#E91E63'][i % 4],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, 20, -20],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics with animated counters */}
      <section className="container px-4 py-20">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1F1B13] to-[#0B0B0B] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-purple-600/5" />

            <CardContent className="p-12 relative z-10">
              <div className="text-center mb-12">
                <Badge className="px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] mb-4">
                  <TrendingUp className="mr-2 h-4 w-4 inline" />
                  Được tin tưởng bởi hơn 200+ tổ chức
                </Badge>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
                  Con số ấn tượng năm 2025
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { end: 200, label: "Sự kiện thành công", icon: Trophy, suffix: "+" },
                  { end: 150000, label: "Lượt bình chọn", icon: Vote, suffix: "+" },
                  { end: 98, label: "Khách hàng hài lòng", icon: Star, suffix: "%" },
                  { end: 99.9, label: "Uptime", icon: Zap, suffix: "%" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-center space-y-3"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center relative">
                      <stat.icon className="h-7 w-7 text-black" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#FFD700]"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                      <AnimatedCounter end={stat.end} />
                      {stat.suffix}
                    </div>
                    <p className="text-[#FAF3E0]/70 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <p className="text-lg text-[#FFE68A] italic" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  "Tăng tương tác khách mời lên <strong className="text-[#FFD700] text-2xl">300%</strong> – Giảm thời gian tổ chức <strong className="text-[#FFD700] text-2xl">70%</strong>"
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Complete Features Section */}
      <section className="container px-4 py-20">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
              Trải nghiệm sự kiện trọn vẹn
            </h2>
            <p className="text-lg text-[#FFE68A] max-w-3xl mx-auto">
              Từ giây phút khách mời bước vào đến khi nhận giải — mọi khoảnh khắc đều được kết nối
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: QrCode,
                title: "Check-in thông minh",
                description: "Khách mời quét mã QR để xác nhận tham dự, tự động ghi danh. Không cần thẻ giấy, không xếp hàng chờ đợi.",
                color: "from-green-500 to-emerald-600",
                features: ["Quét QR nhanh chóng", "Tự động ghi nhận", "Thống kê realtime"],
              },
              {
                icon: Vote,
                title: "Voting cảm xúc",
                description: "Chọn ứng viên yêu thích, xem kết quả realtime trên màn hình lớn. Mọi phiếu bầu đều được xác thực và bảo mật.",
                color: "from-[#FFD700] to-[#FDB931]",
                features: ["Kết quả realtime", "Chống gian lận", "Hiển thị LED"],
              },
              {
                icon: Gift,
                title: "Quay số trúng thưởng",
                description: "Kết hợp chương trình Lucky Draw để tạo cao trào vui nhộn. Hiệu ứng quay số sống động trên màn hình.",
                color: "from-pink-500 to-rose-600",
                features: ["Hiệu ứng 3D", "Random công bằng", "Confetti animation"],
              },
              {
                icon: BarChart3,
                title: "Báo cáo & Thống kê",
                description: "Xuất dữ liệu ngay sau sự kiện. Biểu đồ trực quan, dễ dàng chia sẻ kết quả với ban lãnh đạo.",
                color: "from-purple-500 to-indigo-600",
                features: ["Dashboard realtime", "Xuất Excel/PDF", "Analytics chi tiết"],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="border-2 border-[#FFD700]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] hover:border-[#FFD700]/50 transition-all duration-300 group h-full">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-[#FAF3E0]/70 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-[#FFD700]/20">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#FFD700]" />
                          <span className="text-sm text-[#FAF3E0]/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Theme Preview Carousel - REDESIGNED */}
      <section className="container px-4 py-20">
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] mb-4 inline-flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Tùy biến 100% theo brand
            </Badge>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
              Giao diện tuỳ biến theo sự kiện
            </h2>
            <p className="text-lg text-[#FFE68A] max-w-3xl mx-auto">
              Từ Gala sang trọng đến Wedding lãng mạn — mỗi sự kiện có một phong cách riêng
            </p>
          </div>

          {/* Main Theme Display */}
          <motion.div
            key={currentTheme}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Image */}
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <motion.div
                      key={`img-${currentTheme}`}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={themes[currentTheme].image}
                        alt={themes[currentTheme].name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={currentTheme === 0}
                      />
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${themes[currentTheme].bg} opacity-40`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </motion.div>

                    {/* Category badge on image */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`px-4 py-2 bg-gradient-to-r ${themes[currentTheme].gradient} text-white border-0 shadow-lg text-sm font-semibold`}>
                        {themes[currentTheme].category}
                      </Badge>
                    </div>

                    {/* Floating vote preview */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${themes[currentTheme].gradient} flex items-center justify-center`}>
                            <Vote className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${themes[currentTheme].gradient}`}
                                initial={{ width: "0%" }}
                                animate={{ width: "75%" }}
                                transition={{ delay: 0.6, duration: 1 }}
                              />
                            </div>
                          </div>
                          <span className="text-white text-sm font-bold">75%</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right: Details */}
                  <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
                        {themes[currentTheme].name}
                      </h3>
                      <p className="text-[#FAF3E0]/80 text-lg leading-relaxed">
                        {themes[currentTheme].description}
                      </p>
                    </div>

                    {/* Color palette preview */}
                    <div>
                      <p className="text-sm text-[#FAF3E0]/60 mb-3 uppercase tracking-wider font-semibold">Color Theme</p>
                      <div className="flex gap-2">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${themes[currentTheme].gradient} shadow-lg`} />
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${themes[currentTheme].bg} border border-[#FFD700]/30`} />
                        <div className="w-12 h-12 rounded-lg bg-white/90" />
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <p className="text-sm text-[#FAF3E0]/60 uppercase tracking-wider font-semibold">Key Features</p>
                      {themes[currentTheme].features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-center gap-3 text-[#FAF3E0]"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${themes[currentTheme].gradient}`} />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className={`w-full md:w-auto bg-gradient-to-r ${themes[currentTheme].gradient} hover:opacity-90 text-white font-semibold px-8 py-6 rounded-full`}
                    >
                      <Link href="/vote">
                        Xem Demo Theme
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Selector */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {themes.map((theme, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTheme(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl transition-all ${
                  index === currentTheme
                    ? "ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#0B0B0B]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="relative w-32 h-24">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-60`} />
                  {index === currentTheme && (
                    <div className="absolute inset-0 border-2 border-[#FFD700]" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2">
                  <p className="text-white text-xs font-semibold text-center truncate">{theme.name}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Info footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Card className="border border-[#FFD700]/20 bg-[#1a1a1a]/50 inline-block">
              <CardContent className="px-8 py-4">
                <p className="text-[#FFE68A] text-sm">
                  💡 <strong>Custom Branding:</strong> Logo, màu sắc, font chữ của bạn sẽ được tích hợp hoàn toàn
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Use Cases */}
      <section className="container px-4 py-20">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
              Phù hợp với mọi loại sự kiện
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Doanh nghiệp",
                description: "Year-end party, kỷ niệm công ty, vinh danh nhân viên.",
                gradient: "from-[#FFD700] to-[#FDB931]",
              },
              {
                icon: GraduationCap,
                title: "Tổ chức – trường học",
                description: "Bình chọn tài năng, sắc đẹp, lễ tri ân.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: PartyPopper,
                title: "Agency sự kiện",
                description: "Dùng làm công cụ tương tác khán giả, tăng trải nghiệm.",
                gradient: "from-pink-500 to-rose-500",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-2 border-[#FFD700]/20 bg-[#1a1a1a] hover:border-[#FFD700]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/20 group h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <useCase.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FFD700]">{useCase.title}</h3>
                    <p className="text-[#FAF3E0]/80 leading-relaxed">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-semibold px-8 py-6 text-lg rounded-full"
            >
              <Link href="/pricing">
                Liên hệ để tích hợp cho sự kiện của bạn
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-20">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4" style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-[#FFD700]/30 bg-[#1a1a1a]">
              <CardContent className="p-8 md:p-12">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>

                <p className="text-xl text-[#FAF3E0] italic text-center mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-[#FFD700]">
                    <AvatarFallback className="bg-gradient-to-br from-[#FFD700] to-[#FDB931] text-black font-bold text-lg">
                      {testimonials[currentTestimonial].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-[#FAF3E0]/70">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-[#FFD700] text-sm">
                      {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentTestimonial
                    ? "w-8 bg-[#FFD700]"
                    : "w-2 bg-[#FAF3E0]/30 hover:bg-[#FAF3E0]/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="relative py-24 overflow-hidden">
        {/* Background gradient with spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]" />

        {/* Animated spotlight sweep */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Animated sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? '#FFD700' : '#FDB931',
                boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: [0, 1.5, 1, 0],
                y: [0, -50],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="container relative px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <div className="relative">
                  <Award className="h-24 w-24 text-[#FFD700] mx-auto" />
                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                        '0 0 40px 20px rgba(255, 215, 0, 0.1)',
                        '0 0 20px 10px rgba(255, 215, 0, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold">
                <span className="block mb-2 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9E00] bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
                  Bạn muốn khán giả của mình
                </span>
                <span className="block text-white" style={{ textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
                  vừa cười, vừa vote, vừa hò reo?
                </span>
              </h2>
            </motion.div>

            {/* Subtitle with emoji */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-[#E5E5E5] max-w-3xl mx-auto leading-relaxed"
            >
              Hãy để <strong className="text-[#FFD700]">Event Voting</strong> biến mỗi sự kiện thành một trải nghiệm đáng nhớ 🎉
            </motion.p>

            {/* Stats highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-6 py-6"
            >
              {[
                { value: "200+", label: "Sự kiện" },
                { value: "150K+", label: "Lượt vote" },
                { value: "98%", label: "Hài lòng" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[#FFD700]">{stat.value}</div>
                  <div className="text-sm text-[#FAF3E0]/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FF9E00] hover:from-[#FF9E00] hover:to-[#FFD700] text-black font-bold shadow-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all duration-300 relative overflow-hidden group"
                >
                  <Link href="/pricing">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Đặt lịch Demo
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-7 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300"
                >
                  Liên hệ Tư vấn
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="pt-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] border border-[#FFD700]/30">
                <CheckCircle className="h-5 w-5 text-[#FFD700]" />
                <span className="text-sm text-[#FAF3E0]">
                  Setup trong 24h • Hỗ trợ miễn phí • Không ràng buộc dài hạn
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#FFD700]/30 mt-16 bg-[#0B0B0B]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />

        <div className="container px-4 py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 group">
              <Crown className="h-6 w-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
              <span className="text-xl font-playfair font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
                Event Voting System
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[#FFE68A] font-medium">
                © 2025 Event Voting by Code4Change.tech
              </p>
              <p className="text-sm text-[#FAF3E0]/60">
                Website: <a href="https://quaysotrungthuong.vn" className="hover:text-[#FFD700] transition-colors">quaysotrungthuong.vn</a>
              </p>
              <p className="text-sm text-[#FAF3E0]/60">
                Liên hệ: <a href="mailto:contact@code4change.tech" className="hover:text-[#FFD700] transition-colors">contact@code4change.tech</a>
              </p>
            </div>

            <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
