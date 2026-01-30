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
  Play, CheckCircle2, Eye, ChevronRight, Gamepad2, Heart
} from "lucide-react"

// Brand Colors - ESTRON
const BRAND_COLORS = {
  primary: '#009933', // Green
  secondary: '#CC0000', // Red
  accent: '#00B347', // Light green
  dark: '#006622', // Dark green
  navy: '#1a365d', // Navy blue for dress code theme
}

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
            background: i % 3 === 0 ? BRAND_COLORS.primary : i % 3 === 1 ? BRAND_COLORS.secondary : '#FFFFFF',
            boxShadow: `0 0 8px ${BRAND_COLORS.primary}99`,
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
          className="w-12 h-12 rounded-full flex items-center justify-center z-10"
          style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        {/* Connecting line */}
        <div className="w-0.5 h-20 mt-2" style={{ background: `linear-gradient(to bottom, ${BRAND_COLORS.primary}, transparent)` }} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {link ? (
          <Link href={link}>
            <motion.div
              className="bg-gradient-to-r from-[#1a1a1a] to-[#0D0D1A] border-2 rounded-2xl p-6 group-hover:border-[#009933] transition-all duration-300 cursor-pointer"
              style={{ borderColor: `${BRAND_COLORS.primary}33` }}
              whileHover={{ x: 10, boxShadow: `0 0 30px ${BRAND_COLORS.primary}4D` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg mb-2" style={{ color: BRAND_COLORS.primary }}>{time}</div>
                  <div className="text-white text-xl font-semibold">{title}</div>
                </div>
                <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: BRAND_COLORS.primary }} />
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div
            className="bg-gradient-to-r from-[#1a1a1a] to-[#0D0D1A] border-2 rounded-2xl p-6 transition-all duration-300"
            style={{ borderColor: `${BRAND_COLORS.primary}33` }}
            whileHover={{ x: 10, boxShadow: `0 0 30px ${BRAND_COLORS.primary}4D` }}
          >
            <div className="font-bold text-lg mb-2" style={{ color: BRAND_COLORS.primary }}>{time}</div>
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
        colors: [BRAND_COLORS.primary, BRAND_COLORS.secondary, '#FFFFFF', BRAND_COLORS.accent]
      })
    }, 800)

    // Periodic confetti every 30 seconds
    const interval = setInterval(() => {
      setAutoConfetti(true)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8, x: Math.random() },
        colors: [BRAND_COLORS.primary, BRAND_COLORS.accent, '#FFFFFF']
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
      colors: [BRAND_COLORS.primary, BRAND_COLORS.accent, BRAND_COLORS.secondary]
    })
  }

  // Timeline data - Updated from Slide 4
  const timeline = [
    { time: "17:00", title: "Đón khách và Check-in", icon: Users, link: `/event/${eventId}/check-in` },
    { time: "18:00", title: "Khai mạc chương trình", icon: Star, link: `/event/${eventId}/welcome` },
    { time: "18:05", title: "Tri ân gắn bó", icon: Heart, link: null },
    { time: "18:30", title: "Dùng tiệc", icon: Utensils, link: null },
    { time: "18:40", title: "Trò chơi lớn", icon: Gamepad2, link: `/event/${eventId}/minigame` },
    { time: "19:00", title: "Bốc thăm trúng thưởng & Văn nghệ", icon: Gift, link: `https://quaysotrungthuong.vn/app` },
    { time: "20:40", title: "Bình chọn tiết mục văn nghệ hay nhất", icon: Vote, link: `/event/${eventId}/vote` },
    { time: "21:30", title: "Bế mạc chương trình", icon: PartyPopper, link: null },
  ]

  // Interactive Event Activities - Event Experience Focused
  const eventActivities = [
    {
      icon: QrCode,
      title: "Check-in tại cổng",
      description: "Quét mã QR và nhận lời chào mừng cá nhân hóa với tên của bạn trên màn hình LED",
      color: `from-[${BRAND_COLORS.primary}] to-[${BRAND_COLORS.accent}]`,
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
      description: "Xem lại những khoảnh khắc đáng nhớ của ESTRON VIETNAM trong năm qua",
      color: "from-pink-500 to-rose-600",
      link: `/event/${eventId}/waiting`,
      badge: "Memory",
      preview: "Xem lại hành trình 2025"
    },
    {
      icon: Gamepad2,
      title: "Trò chơi lớn",
      description: "Tham gia trò chơi tương tác vui nhộn cùng đồng nghiệp và giành phần thưởng hấp dẫn",
      color: "from-purple-500 to-violet-600",
      link: `/event/${eventId}/minigame`,
      badge: "Fun",
      preview: "Chơi ngay"
    },
    {
      icon: Gift,
      title: "Quay số trúng thưởng",
      description: "Cơ hội nhận quà hấp dẫn với hiệu ứng confetti ngoạn mục khi trúng giải",
      color: `from-[${BRAND_COLORS.primary}] to-[${BRAND_COLORS.accent}]`,
      link: `https://quaysotrungthuong.vn/app`,
      badge: "Lucky",
      preview: "Thử vận may của bạn"
    },
    {
      icon: Vote,
      title: "Bình chọn văn nghệ hay nhất",
      description: "Bình chọn cho tiết mục văn nghệ bạn yêu thích nhất - kết quả hiện ngay trên màn hình",
      color: "from-blue-500 to-indigo-600",
      link: `/event/${eventId}/vote`,
      badge: "Vote",
      preview: "Tham gia bình chọn"
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
        {/* Background Image - Lunar New Year theme */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/estro/background.png)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D1A]" />
        </div>

        {/* Spotlight Animation */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              `radial-gradient(circle at 30% 50%, ${BRAND_COLORS.primary}4D 0%, transparent 50%)`,
              `radial-gradient(circle at 70% 50%, ${BRAND_COLORS.primary}4D 0%, transparent 50%)`,
              `radial-gradient(circle at 30% 50%, ${BRAND_COLORS.primary}4D 0%, transparent 50%)`,
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
            {/* ESTRON Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <Image
                src="/estro/logo.png"
                alt="ESTRON Logo"
                width={200}
                height={60}
                className="h-16 w-auto"
              />
            </motion.div>

            {/* Event Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 1, delay: 0.5 }}
            >
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_COLORS.primary}33, ${BRAND_COLORS.secondary}33)`,
                  borderColor: BRAND_COLORS.primary
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
                <span className="font-bold text-lg" style={{ color: BRAND_COLORS.primary }}>YEAR END PARTY 2026</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="block text-white mb-3" style={{ textShadow: `0 0 30px ${BRAND_COLORS.primary}80` }}>
                XOẮN CHẶT KẾT NỐI
              </span>
              <span
                className="block bg-clip-text text-transparent animate-pulse"
                style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent}, ${BRAND_COLORS.primary})` }}
              >
                MỞ LỐI TƯƠNG LAI
              </span>
              <span className="block text-white text-2xl md:text-3xl mt-4 italic" style={{ textShadow: `0 0 20px ${BRAND_COLORS.primary}4D` }}>
                Tightly Connected – Opening the Future
              </span>
            </motion.h1>

            {/* Subtitle - Emotional tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              ESTRON VIETNAM Year End Party 2026
            </motion.p>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center text-lg"
            >
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6" style={{ color: BRAND_COLORS.primary }} />
                <span>17:00 | 31/01/2026</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-6 h-6" style={{ color: BRAND_COLORS.primary }} />
                <span>Sảnh Marble, Tầng 2 - ADORA Center</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6" style={{ color: BRAND_COLORS.primary }} />
                <span>Dress code: Xanh dương & Xanh lá</span>
              </div>
            </motion.div>

            {/* Single CTA - Scroll to About Event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
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
                    className="text-lg px-10 py-7 rounded-full text-white font-bold shadow-2xl relative overflow-hidden group"
                    style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                    icon={<Sparkles className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Khám phá sự kiện
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
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2" style={{ borderColor: BRAND_COLORS.primary }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: BRAND_COLORS.primary }}
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
              Về <span style={{ color: BRAND_COLORS.primary }}>Sự kiện</span>
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
                  className="absolute -left-4 top-0 w-1 h-full"
                  style={{ background: `linear-gradient(to bottom, ${BRAND_COLORS.primary}, transparent)` }}
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <div className="space-y-4 pl-4">
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed italic">
                    "Xoắn chặt kết nối, mở lối tương lai - Cùng nhau vươn xa hơn trong năm mới 2026!"
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Year End Party 2026 của ESTRON VIETNAM là dịp để chúng ta cùng nhìn lại hành trình một năm đầy thử thách và thành công,
                    tri ân những cống hiến và gắn bó của mỗi thành viên.
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Hãy cùng ESTRON VIETNAM <span style={{ color: BRAND_COLORS.primary }} className="font-semibold">tỏa sáng</span>,
                    <span style={{ color: BRAND_COLORS.primary }} className="font-semibold"> kết nối</span> và
                    <span style={{ color: BRAND_COLORS.primary }} className="font-semibold"> mở lối tương lai</span> trong đêm tiệc cuối năm đầy ý nghĩa này.
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
                <Link href={`/event/${eventId}/check-in`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <MyButton
                      variant="primary"
                      size="large"
                      className="px-8 py-4 rounded-full text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                      icon={<QrCode className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      Check-in ngay
                    </MyButton>
                  </motion.div>
                </Link>
                <Link href={`/event/${eventId}/live`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <MyButton
                      variant="outline"
                      size="large"
                      className="px-8 py-4 rounded-full border-2 hover:text-white"
                      style={{ borderColor: BRAND_COLORS.primary, color: BRAND_COLORS.primary }}
                      icon={<MonitorPlay className="h-5 w-5" />}
                      iconPosition="left"
                    >
                      Xem màn hình Live
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
                <div
                  className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 rounded-3xl p-8 transition-all duration-300 overflow-hidden"
                  style={{ borderColor: `${BRAND_COLORS.primary}4D` }}
                >
                  {/* Green gradient border glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}1A, transparent)` }} />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Clock className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: BRAND_COLORS.primary }}>Thời gian</h3>
                    <p className="text-white text-lg mb-2">17:00 - 21:30</p>
                    <p className="text-gray-400">Thứ Bảy, 31/01/2026</p>
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
                <div
                  className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 rounded-3xl p-8 transition-all duration-300 overflow-hidden"
                  style={{ borderColor: `${BRAND_COLORS.primary}4D` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}1A, transparent)` }} />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: BRAND_COLORS.primary }}>Địa điểm</h3>
                    <p className="text-white text-lg mb-2">Sảnh Marble, Tầng 2 - ADORA Center</p>
                    <p className="text-gray-400">431 Hoàng Văn Thụ, Phường 4, Tân Bình, TP.HCM</p>
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
                <div
                  className="relative bg-gradient-to-br from-[#1a1a1a]/60 to-[#0D0D1A]/60 backdrop-blur-xl border-2 rounded-3xl p-8 transition-all duration-300 overflow-hidden"
                  style={{ borderColor: `${BRAND_COLORS.primary}4D` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}1A, transparent)` }} />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: BRAND_COLORS.primary }}>Dress Code</h3>
                    <p className="text-white text-lg mb-2">Xanh dương & Xanh lá</p>
                    <p className="text-gray-400">Tỏa sáng cùng sắc xanh sang trọng</p>
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
              <span style={{ color: BRAND_COLORS.primary }}>Chương trình</span> trong đêm
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
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}0D, ${BRAND_COLORS.secondary}0D, #0D0D1A)` }} />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Khoảnh khắc <span style={{ color: BRAND_COLORS.primary }}>Đáng nhớ</span>
            </h2>
            <p className="text-xl text-gray-400">Những hình ảnh từ các sự kiện của ESTRON VIETNAM</p>
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
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.primary }}>
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Green border glow on hover */}
                <motion.div
                  className="absolute inset-0 border-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  style={{ borderColor: BRAND_COLORS.primary }}
                  animate={{
                    boxShadow: [
                      `0 0 0px ${BRAND_COLORS.primary}00`,
                      `0 0 30px ${BRAND_COLORS.primary}CC`,
                      `0 0 0px ${BRAND_COLORS.primary}00`,
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
              <Zap className="w-16 h-16" style={{ color: BRAND_COLORS.primary }} />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Trải nghiệm <span style={{ color: BRAND_COLORS.primary }}>đáng nhớ</span> trong đêm
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Khám phá những hoạt động độc đáo được thiết kế riêng cho Year End Party 2026
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
                  <div
                    className="relative overflow-hidden border-2 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D1A] rounded-2xl p-6 transition-all duration-300 group h-full cursor-pointer"
                    style={{ borderColor: `${BRAND_COLORS.primary}33` }}
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: BRAND_COLORS.primary }}>
                        {activity.badge}
                      </span>
                    </div>

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, ${BRAND_COLORS.primary}1A 50%, transparent 70%)`,
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
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: BRAND_COLORS.primary }} />
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      {/* Action hint */}
                      <div className="pt-2">
                        <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1" style={{ color: BRAND_COLORS.primary }}>
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

      {/* LUCKY DRAW SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D1A]">
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
              <Gift className="w-20 h-20 mx-auto" style={{ color: BRAND_COLORS.primary }} />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Mini Game & <span style={{ color: BRAND_COLORS.primary }}>Quay số may mắn</span>
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
                      className="text-lg px-10 py-7 rounded-full text-white font-bold shadow-2xl"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.primary})` }}
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
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}CC, #0D0D1A, ${BRAND_COLORS.secondary}CC)` }} />

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
                  `0 0 20px ${BRAND_COLORS.primary}4D`,
                  `0 0 40px ${BRAND_COLORS.primary}99`,
                  `0 0 20px ${BRAND_COLORS.primary}4D`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-20 h-20 mx-auto mb-8" style={{ color: BRAND_COLORS.primary }} />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-relaxed">
              Cảm ơn bạn đã là một phần của<br />
              <span className="italic" style={{ color: BRAND_COLORS.primary }}>hành trình 2025 rực rỡ</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mt-6 italic">
              "Xoắn chặt kết nối - Mở lối tương lai"<br />
              <span style={{ color: BRAND_COLORS.primary }}>ESTRON VIETNAM Year End Party 2026</span>
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
                    className="px-10 py-5 rounded-full border-2 font-semibold transition-all hover:text-white"
                    style={{ borderColor: BRAND_COLORS.primary, color: BRAND_COLORS.primary }}
                    icon={<Sparkles className="h-6 w-6" />}
                    iconPosition="left"
                  >
                    Khám phá nền tảng tổ chức sự kiện Bright4Event
                  </MyButton>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#0D0D1A] border-t-2 py-12" style={{ borderColor: `${BRAND_COLORS.primary}4D` }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.primary}, transparent)` }} />

        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center gap-4 mb-6"
              >
                <Image
                  src="/estro/logo.png"
                  alt="ESTRON Logo"
                  width={150}
                  height={45}
                  className="h-12 w-auto"
                />
                <span className="text-2xl font-bold text-white">ESTRON VIETNAM</span>
              </motion.div>

              {/* Social Links */}
              <div className="flex gap-6 justify-center mb-8">
                {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <Link href="https://www.facebook.com/bright4event" target="_blank" rel="noopener noreferrer" key={social}>
                      <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="text-gray-400 cursor-pointer transition-colors"
                          style={{ }}
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
                  <Link href="/public" className="font-semibold transition-colors" style={{ color: BRAND_COLORS.primary }}>
                    Bright4Event
                  </Link>
                </p>
                <p className="text-sm italic mb-3" style={{ color: BRAND_COLORS.primary }}>
                  "Light up your event"
                </p>
                <p className="text-gray-600 text-xs">
                  © 2026 ESTRON VIETNAM. All rights reserved.
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
            <Link href={`/event/${eventId}/check-in`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${BRAND_COLORS.primary}66`,
                    `0 0 40px ${BRAND_COLORS.primary}CC`,
                    `0 0 20px ${BRAND_COLORS.primary}66`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <MyButton
                  variant="primary"
                  size="large"
                  className="px-8 py-6 rounded-full text-white font-bold shadow-2xl flex items-center gap-3"
                  style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                  icon={<QrCode className="h-6 w-6 animate-pulse" />}
                  iconPosition="left"
                >
                  <span className="text-lg">Check-in ngay</span>
                </MyButton>

                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: BRAND_COLORS.primary }}
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
