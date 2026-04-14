"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import MyButton from "@/components/MyButton"
import confetti from "canvas-confetti"
import {
  MapPin, Clock, Users, Trophy, Sparkles,
  Vote, BarChart3, Gift, Star,
  Camera, Music, Utensils, Award, PartyPopper,
  QrCode, MonitorPlay, Radio, Zap, TrendingUp,
  Play, CheckCircle2, Eye, ChevronRight, Gamepad2
} from "lucide-react"

// Confetti Component
function FloatingConfetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#9C27FF' : '#FFFFFF',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// Timeline Item Component
function TimelineItem({ time, title, icon: Icon, index, link }: any) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="flex gap-6 items-start group"
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center z-10"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-black" />
        </motion.div>
        {/* Connecting line */}
        <div className="w-0.5 h-20 bg-gradient-to-b from-[#FFD700] to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {link ? (
          <Link href={link}>
            <motion.div
              className="bg-gradient-to-r from-[#1a1a1a] to-[#0D0D1A] border-2 border-[#FFD700]/20 rounded-2xl p-6 group-hover:border-[#FFD700] transition-all duration-300 cursor-pointer"
              whileHover={{ x: 10, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#FFD700] font-bold text-lg mb-2">{time}</div>
                  <div className="text-white text-xl font-semibold">{title}</div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div
            className="bg-gradient-to-r from-[#1a1a1a] to-[#0D0D1A] border-2 border-[#FFD700]/20 rounded-2xl p-6 group-hover:border-[#FFD700] transition-all duration-300"
            whileHover={{ x: 10, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
          >
            <div className="text-[#FFD700] font-bold text-lg mb-2">{time}</div>
            <div className="text-white text-xl font-semibold">{title}</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function EventLandingPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [autoConfetti, setAutoConfetti] = useState(false)

  // Trigger confetti on page load and periodically
  useEffect(() => {
    // Initial confetti burst on page load
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF', '#9C27FF']
      })
    }, 800)

    // Periodic confetti every 30 seconds
    const interval = setInterval(() => {
      setAutoConfetti(true)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8, x: Math.random() },
        colors: ['#FFD700', '#FDB931', '#FFFFFF']
      })
      setTimeout(() => setAutoConfetti(false), 3000)
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Show floating CTA on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FDB931', '#FFA500']
    })
  }

  // Timeline data
  const timeline = [
    { time: "18:30", title: "Đón khách & Check-in", icon: Users, link: `/event/${eventId}/check-in` },
    { time: "19:00", title: "Khai mạc chương trình", icon: Star, link: `/event/${eventId}/welcome-screen` },
    { time: "19:30", title: "Dinner & Gameshow", icon: Utensils, link: null },
    { time: "20:30", title: "Biểu diễn & nghệ thuật", icon: Music, link: null },
    { time: "21:00", title: "Vinh danh & Bình chọn", icon: Award, link: `/event/${eventId}/vote` },
    { time: "22:00", title: "Quay số & Bế mạc", icon: PartyPopper, link: `https://quaysotrungthuong.vn/app` },
  ]

  // Interactive Event Activities - Event Experience Focused
  const eventActivities = [
    {
      icon: QrCode,
      title: "Check-in tại cổng",
      description: "Quét mã QR và nhận lời chào mừng cá nhân hóa với tên của bạn trên màn hình LED",
      color: "from-green-500 to-emerald-600",
      link: `/event/${eventId}/check-in`,
      badge: "Welcome",
      preview: "Xem trước màn hình chào mừng"
    },
    {
      icon: MonitorPlay,
      title: "Màn hình chào mừng LED",
      description: "Tên bạn sẽ xuất hiện rực rỡ trên màn hình LED khổng lồ khi bước vào hội trường",
      color: "from-cyan-500 to-blue-600",
      link: `/event/${eventId}/welcome`,
      badge: "Live",
      preview: "Khám phá trải nghiệm LED"
    },
    {
      icon: Radio,
      title: "Slideshow kỷ niệm",
      description: "Xem lại những khoảnh khắc đáng nhớ của Code4Change Media trong năm qua",
      color: "from-pink-500 to-rose-600",
      link: `/event/${eventId}/waiting`,
      badge: "Memory",
      preview: "Xem lại hành trình 2025"
    },
    {
      icon: Vote,
      title: "Bình chọn Nhân viên của năm",
      description: "Bầu chọn người lan tỏa năng lượng tích cực nhất - kết quả hiện ngay trên màn hình",
      color: "from-blue-500 to-indigo-600",
      link: `/event/${eventId}/vote`,
      badge: "Vote Now",
      preview: "Tham gia bình chọn"
    },
    {
      icon: Gift,
      title: "Quay số trúng thưởng",
      description: "Cơ hội nhận quà hấp dẫn với hiệu ứng confetti ngoạn mục khi trúng giải",
      color: "from-[#FFD700] to-[#FDB931]",
      link: `https://quaysotrungthuong.vn/app`,
      badge: "Lucky",
      preview: "Thử vận may của bạn"
    },
    {
      icon: Gamepad2,
      title: "Mini Games tương tác",
      description: "Tham gia trò chơi vui nhộn cùng đồng nghiệp và giành phần thưởng hấp dẫn",
      color: "from-purple-500 to-violet-600",
      link: `/event/${eventId}/minigame`,
      badge: "Fun",
      preview: "Chơi ngay"
    },
  ]

  // Gallery images (local assets)
  const galleryImages = [
    "/gallery/event-1.jpg",
    "/gallery/event-2.jpg",
    "/gallery/event-3.jpg",
    "/gallery/event-4.jpg",
    "/gallery/event-5.jpg",
    "/gallery/event-6.jpg",
    "/gallery/event-7.jpg",
    "/gallery/event-8.jpg",
    "/gallery/event-9.jpg",
    "/gallery/event-10.jpg",
  ]

  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/gallery/event-1.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0D0D1A]" />
        </div>

        {/* Spotlight Animation */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Confetti */}
        <FloatingConfetti />

        {/* Hero Content */}
        <div className="relative container px-4 py-32 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Event Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#9C27FF]/20 border-2 border-[#FFD700]">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="text-[#FFD700] font-bold text-lg">YEAR END PARTY 2025</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="block text-white mb-3" style={{ textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
                GLOW UP 2025
              </span>
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent animate-pulse">
                YEAR END PARTY
              </span>
              <span className="block text-white text-4xl md:text-5xl mt-4" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
                OF CODE4CHANGE MEDIA
              </span>
            </motion.h1>

            {/* Subtitle - Emotional tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed italic"
            >
              "Đêm tri ân, kết nối và lan tỏa năng lượng sáng tạo"
            </motion.p>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center text-lg"
            >
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6 text-[#FFD700]" />
                <span>19:00 | 28/12/2025</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-6 h-6 text-[#FFD700]" />
                <span>GEM Center, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6 text-[#FFD700]" />
                <span>Dress code: Sparkle Gold & Black</span>
              </div>
            </motion.div>

            {/* Single CTA - Scroll to About Event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex justify-center pt-8"
            >
              <button
                onClick={() => {
                  const aboutSection = document.getElementById('about-event')
                  aboutSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] text-black font-bold shadow-2xl relative overflow-hidden group"
                    icon={<Sparkles className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Khám phá sự kiện ✨
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </MyButton>
                </motion.div>
              </button>
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

      {/* ABOUT EVENT SECTION */}
      <section id="about-event" className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Về <span className="text-[#FFD700]">Sự kiện</span>
            </h2>
          </motion.div>

          {/* 2-Column Layout: Emotional Description + Info Cards */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Emotional Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="relative">
                <motion.div
                  className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#FFD700] to-transparent"
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <div className="space-y-4 pl-4">
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed italic">
                    "Một năm đã qua, chúng ta đã cùng nhau vượt qua thử thách, chia sẻ niềm vui và tạo nên những giá trị đích thực."
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Year End Party 2025 không chỉ là buổi tiệc tri ân, mà là khoảnh khắc để mỗi người trong chúng ta cùng nhìn lại hành trình,
                    vinh danh những cống hiến và lan tỏa năng lượng sáng tạo cho năm mới.
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Hãy cùng Code4Change Media <span className="text-[#FFD700] font-semibold">tỏa sáng</span>,
                    <span className="text-[#FFD700] font-semibold"> kết nối</span> và
                    <span className="text-[#FFD700] font-semibold"> truyền cảm hứng</span> trong đêm tri ân đầy cảm xúc này.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <Link href={`/app/%5Blocale%5D/event/${eventId}/vote`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <MyButton
                      variant="primary"
                      size="large"
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold"
                      icon={<Vote className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      Bình chọn ngay
                    </MyButton>
                  </motion.div>
                </Link>
                <Link href={`/app/%5Blocale%5D/event/${eventId}/results`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <MyButton
                      variant="outline"
                      size="large"
                      className="px-8 py-4 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                      icon={<BarChart3 className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      Xem kết quả
                    </MyButton>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Info Cards with Glassy Effect */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 border-[#FFD700]/30 rounded-3xl p-8 hover:border-[#FFD700] transition-all duration-300 overflow-hidden">
                  {/* Gold gradient border glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-2xl flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Clock className="w-8 h-8 text-black" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-3">Thời gian</h3>
                    <p className="text-white text-lg mb-2">19:00 - 23:00</p>
                    <p className="text-gray-400">Thứ Bảy, 28/12/2025</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 border-[#FFD700]/30 rounded-3xl p-8 hover:border-[#FFD700] transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-2xl flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin className="w-8 h-8 text-black" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-3">Địa điểm</h3>
                    <p className="text-white text-lg mb-2">GEM Center</p>
                    <p className="text-gray-400">8 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 border-[#FFD700]/30 rounded-3xl p-8 hover:border-[#FFD700] transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-2xl flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles className="w-8 h-8 text-black" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-3">Dress Code</h3>
                    <p className="text-white text-lg mb-2">Sparkle Gold & Black</p>
                    <p className="text-gray-400">Tỏa sáng cùng sắc vàng ánh kim và đen huyền bí</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-[#FFD700]">Chương trình</span> trong đêm
            </h2>
            <p className="text-xl text-gray-400">Khoảnh khắc được mong đợi</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                time={item.time}
                title={item.title}
                icon={item.icon}
                link={item.link}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-[#9C27FF]/5 to-[#0D0D1A]" />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Khoảnh khắc <span className="text-[#FFD700]">Đáng nhớ</span>
            </h2>
            <p className="text-xl text-gray-400">Những hình ảnh từ các sự kiện của Code4Change Media</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className={`relative overflow-hidden rounded-2xl ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } group cursor-pointer`}
                style={{ aspectRatio: index % 5 === 0 ? '1' : '1' }}
              >
                <Image
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center">
                      <Camera className="w-8 h-8 text-black" />
                    </div>
                  </motion.div>
                </div>

                {/* Gold border glow on hover */}
                <motion.div
                  className="absolute inset-0 border-4 border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(255, 215, 0, 0)',
                      '0 0 30px rgba(255, 215, 0, 0.8)',
                      '0 0 0px rgba(255, 215, 0, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES SHOWCASE SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Zap className="w-16 h-16 text-[#FFD700]" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Trải nghiệm <span className="text-[#FFD700]">đáng nhớ</span> trong đêm
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Khám phá những hoạt động độc đáo được thiết kế riêng cho Year End Party 2025
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {eventActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Link href={activity.link} target="_blank" rel="noopener noreferrer">
                  <div className="relative overflow-hidden border-2 border-[#FFD700]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] hover:border-[#FFD700] rounded-2xl p-6 transition-all duration-300 group h-full cursor-pointer">
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-[#FFD700] text-black text-xs font-bold rounded-full">
                        {activity.badge}
                      </span>
                    </div>

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative z-10 space-y-4">
                      {/* Icon */}
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center`}
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <activity.icon className="h-8 w-8 text-white" />
                      </motion.div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                          {activity.title}
                          <ChevronRight className="w-5 h-5 text-[#FFD700] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      {/* Action hint */}
                      <div className="pt-2">
                        <span className="text-[#FFD700] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          {activity.preview}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* VOTING SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF] via-[#0D0D1A] to-[#FFD700]" />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.3) 50%, transparent 70%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Trophy className="w-24 h-24 mx-auto text-[#FFD700]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Bình chọn <span className="text-[#FFD700]">Nhân viên</span><br />
              Được yêu thích nhất
            </h2>

            <p className="text-xl md:text-2xl text-gray-200">
                Hé lộ người lan tỏa năng lượng tích cực suốt năm qua. Hãy bình chọn ngay!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href={`/app/%5Blocale%5D/event/${eventId}/vote`} className='bg-transparent'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                      '0 0 40px rgba(255, 215, 0, 0.6)',
                      '0 0 20px rgba(255, 215, 0, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full"
                >
                  <MyButton
                    variant="primary"
                    size="large"
                    className="text-lg px-12 py-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold shadow-2xl"
                    icon={<Vote className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Tham gia bình chọn
                  </MyButton>
                </motion.div>
              </Link>

              <Link href={`/app/%5Blocale%5D/event/${eventId}/results`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <MyButton
                    variant="outline"
                    size="large"
                    className="text-lg px-12 py-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#9C27FF] font-semibold"
                    icon={<BarChart3 className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Xem kết quả
                  </MyButton>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LUCKY DRAW SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#0D0D1A] to-[#1a1a1a]">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Gift className="w-20 h-20 mx-auto text-[#FFD700]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Mini Game & <span className="text-[#FFD700]">Quay số may mắn</span>
            </h2>

            <p className="text-xl text-gray-400">
                Cơ hội nhận quà hấp dẫn dành cho tất cả khách tham gia!
            </p>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-block"
            >
              <Link href={"https://quaysotrungthuong.vn/app"} target={"_blank"} rel="noopener noreferrer">
                  <MyButton
                      variant="primary"
                      size="large"
                      className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-[#9C27FF] to-[#FFD700] text-white font-bold shadow-2xl"
                      icon={<PartyPopper className="h-6 w-6" />}
                      iconPosition="left"
                  >
                      Xem quay số trực tiếp
                  </MyButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CLOSING SECTION */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9C27FF]/80 via-[#0D0D1A] to-[#FFD700]/80" />

        {/* Fireworks animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 3, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,215,0,0.3)',
                  '0 0 40px rgba(255,215,0,0.6)',
                  '0 0 20px rgba(255,215,0,0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-20 h-20 mx-auto text-[#FFD700] mb-8" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-relaxed">
              Cảm ơn bạn đã là một phần của<br />
              <span className="text-[#FFD700] italic">hành trình 2025 rực rỡ</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mt-6 italic">
              "Hẹn gặp lại tại <span className="text-[#FFD700]">Year End Party 2026</span><br />
              – Nơi mọi khoảnh khắc đều tỏa sáng ✨"
            </p>

            {/* CTA to Bright4Event platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Link href="/public" className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MyButton
                    variant="outline"
                    size="large"
                    className="px-10 py-5 rounded-full border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold transition-all"
                    icon={<Sparkles className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Khám phá nền tảng tổ chức sự kiện Bright4Event →
                  </MyButton>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0D0D1A] border-t-2 border-[#FFD700]/30 py-12">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <Sparkles className="w-10 h-10 text-[#FFD700]" />
                <span className="text-4xl font-bold text-white">Code4Change Media</span>
                <Sparkles className="w-10 h-10 text-[#FFD700]" />
              </motion.div>

              {/* Social Links */}
              <div className="flex gap-6 justify-center mb-8">
                {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <Link href="https://www.facebook.com/bright4event" target="_blank" rel="noopener noreferrer">
                      <motion.span
                          key={social}
                          whileHover={{ scale: 1.1, color: '#FFD700' }}
                          className="text-gray-400 hover:text-[#FFD700] cursor-pointer transition-colors"
                      >
                          {social}
                      </motion.span>
                  </Link>
                ))}
              </div>

              {/* Powered by */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-500 text-sm mb-2">
                  Powered by{' '}
                  <Link href="/public" className="text-[#FFD700] font-semibold hover:text-[#FDB931] transition-colors">
                    Bright4Event
                  </Link>
                </p>
                <p className="text-[#FFD700] text-sm italic mb-3">
                  "Light up your event"
                </p>
                <p className="text-gray-600 text-xs">
                  © 2025 Code4Change Media. All rights reserved.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING CTA BUTTON */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Link href={`/app/%5Blocale%5D/event/${eventId}/vote`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.4)',
                    '0 0 40px rgba(255, 215, 0, 0.8)',
                    '0 0 20px rgba(255, 215, 0, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <MyButton
                  variant="primary"
                  size="large"
                  className="px-8 py-6 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold shadow-2xl flex items-center gap-3"
                  icon={<Vote className="h-6 w-6 animate-pulse" />}
                  iconPosition="left"
                >
                  <span className="text-lg">Bình chọn ngay 🔥</span>
                </MyButton>

                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#FFD700]"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
