"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"
import {
  Sparkles, MapPin, Clock, Star, Gift, Users
} from "lucide-react"

// Brand Colors - ESTRON (Red as primary per feedback)
const BRAND_COLORS = {
  primary: '#CC0000', // Red - main color
  secondary: '#009933', // Green
  accent: '#FF3333', // Light red
  gold: '#FFD700', // Gold accent for Lunar New Year
}

// Floating particles component - Red theme
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? BRAND_COLORS.primary : i % 3 === 1 ? BRAND_COLORS.gold : '#FFFFFF',
            boxShadow: `0 0 10px ${BRAND_COLORS.primary}CC`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

// Spotlight beams - Red theme
function SpotlightBeams() {
  return (
    <>
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${BRAND_COLORS.primary}66 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${BRAND_COLORS.primary}66 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${BRAND_COLORS.primary}66 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            `linear-gradient(45deg, transparent 30%, ${BRAND_COLORS.gold}4D 50%, transparent 70%)`,
            `linear-gradient(135deg, transparent 30%, ${BRAND_COLORS.gold}4D 50%, transparent 70%)`,
            `linear-gradient(45deg, transparent 30%, ${BRAND_COLORS.gold}4D 50%, transparent 70%)`,
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </>
  )
}

// Guest welcome display
interface GuestWelcomeProps {
  guestName: string
  onComplete: () => void
}

function GuestWelcome({ guestName, onComplete }: GuestWelcomeProps) {
  useEffect(() => {
    // Fire confetti with red and gold colors
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: [BRAND_COLORS.primary, BRAND_COLORS.gold, '#FFFFFF']
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: [BRAND_COLORS.primary, BRAND_COLORS.gold, '#FFFFFF']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Auto complete after 8 seconds
    const timer = setTimeout(onComplete, 8000)
    return () => clearTimeout(timer)
  }, [guestName, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="block text-white mb-4 font-normal">Chào mừng</span>
          <motion.span
            className="block bg-clip-text text-transparent !leading-[1.2]"
            style={{
              backgroundImage: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.gold}, ${BRAND_COLORS.primary})`
            }}
            animate={{
              textShadow: [
                `0 0 20px ${BRAND_COLORS.primary}4D`,
                `0 0 40px ${BRAND_COLORS.primary}99`,
                `0 0 20px ${BRAND_COLORS.primary}4D`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {guestName}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="inline-block ml-4"
          >
            🎊
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-3xl text-gray-300 mb-8"
        >
          Đã check-in thành công tại <span style={{ color: BRAND_COLORS.gold }}>Year End Party 2026</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 italic max-w-3xl mx-auto"
        >
          "Xoắn chặt kết nối, mở lối tương lai - Chúc bạn một đêm tiệc tuyệt vời!"
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// Slideshow component
function BrandSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/gallery/event-1.jpg",
      text: "Xoắn chặt kết nối, mở lối tương lai",
      subtext: "ESTRON VIETNAM"
    },
    {
      image: "/gallery/event-2.jpg",
      text: "Tightly Connected – Opening the Future",
      subtext: "Year End Party 2026"
    },
    {
      image: "/gallery/event-3.jpg",
      text: "Tri ân gắn bó – Vươn xa cùng nhau",
      subtext: "ESTRON VIETNAM"
    },
    {
      image: "/gallery/event-4.jpg",
      text: "Những khoảnh khắc đáng nhớ",
      subtext: "Cùng nhau tạo nên điều kỳ diệu"
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.1] }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={slides[currentSlide].image}
              alt="Brand slideshow"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          </motion.div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              style={{ textShadow: '0 0 30px rgba(0,0,0,0.8)' }}
            >
              {slides[currentSlide].text}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-2xl md:text-3xl font-semibold"
              style={{ color: BRAND_COLORS.gold }}
            >
              {slides[currentSlide].subtext}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Event info display
function EventInfo() {
  const infoItems = [
    { icon: Clock, title: "Thời gian", value: "17:00 - 21:30 | 31/01/2026" },
    { icon: MapPin, title: "Địa điểm", value: "Sảnh Marble, Tầng 2 - ADORA Center" },
    { icon: Star, title: "Dress Code", value: "Xanh dương & Xanh lá" },
    { icon: Gift, title: "Lucky Draw", value: "Quay số may mắn - Quà hấp dẫn" },
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center px-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
        {infoItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#0D0D1A]/90 border-2 rounded-3xl p-8 backdrop-blur-sm"
            style={{ borderColor: `${BRAND_COLORS.primary}4D` }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.gold})` }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <item.icon className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND_COLORS.gold }}>{item.title}</h3>
            <p className="text-white text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Main Welcome Page
export default function WelcomePage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [mode, setMode] = useState<'welcome' | 'slideshow' | 'eventinfo'>('slideshow')
  const [guestName, setGuestName] = useState<string>("")
  const [guestCount, setGuestCount] = useState(0)
  const idleTimerRef = useRef<NodeJS.Timeout>()

  // Simulate check-in (replace with real WebSocket connection)
  useEffect(() => {
    // Example: Simulate a guest checking in after 3 seconds
    const demoTimer = setTimeout(() => {
      handleGuestCheckIn("Nguyễn Văn A")
    }, 3000)

    return () => clearTimeout(demoTimer)
  }, [])

  const handleGuestCheckIn = (name: string) => {
    setGuestName(name)
    setMode('welcome')
    setGuestCount(prev => prev + 1)

    // Clear existing idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
  }

  const handleWelcomeComplete = () => {
    setMode('slideshow')

    // Switch to event info after 2 minutes of slideshow
    idleTimerRef.current = setTimeout(() => {
      setMode('eventinfo')

      // Switch back to slideshow after showing event info
      setTimeout(() => {
        setMode('slideshow')
      }, 30000) // Show event info for 30 seconds
    }, 120000) // 2 minutes
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - Lunar New Year theme */}
      <div className="absolute inset-0">
        <Image
          src="/estro/welcome-bg.png"
          alt="ESTRON Welcome Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Background effects */}
      <SpotlightBeams />
      <FloatingParticles />

      {/* Top Left - Bright4Event Logo */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-8 h-8" style={{ color: BRAND_COLORS.gold }} />
          <span className="text-2xl font-bold text-white">Bright4Event</span>
        </motion.div>
      </div>

      {/* Top Right - ESTRON Logo & Event Name */}
      <div className="absolute top-8 right-8 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-end gap-2"
        >
          <Image
            src="/estro/logo.png"
            alt="ESTRON Logo"
            width={150}
            height={45}
            className="h-10 w-auto"
          />
          <div className="text-right">
            <div className="text-xl font-bold" style={{ color: BRAND_COLORS.gold }}>YEAR END PARTY 2026</div>
            <div className="text-sm text-white/80">ESTRON VIETNAM</div>
          </div>
        </motion.div>
      </div>

      {/* Guest counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div
          className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a]/80 border-2 rounded-full backdrop-blur-sm"
          style={{ borderColor: `${BRAND_COLORS.primary}4D` }}
        >
          <Users className="w-6 h-6" style={{ color: BRAND_COLORS.gold }} />
          <span className="text-white text-lg">
            Đã có <span className="font-bold" style={{ color: BRAND_COLORS.gold }}>{guestCount}</span> khách tham dự 🎉
          </span>
        </div>
      </motion.div>

      {/* Event theme tagline - Bottom Right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        className="absolute bottom-8 right-8 z-20 text-right"
      >
        <p className="text-white text-lg italic">"Xoắn chặt kết nối"</p>
        <p className="font-bold text-xl" style={{ color: BRAND_COLORS.gold }}>"Mở lối tương lai"</p>
      </motion.div>

      {/* Main content */}
      <div className="relative h-screen">
        <AnimatePresence mode="wait">
          {mode === 'welcome' && (
            <GuestWelcome
              key="welcome"
              guestName={guestName}
              onComplete={handleWelcomeComplete}
            />
          )}
          {mode === 'slideshow' && <BrandSlideshow key="slideshow" />}
          {mode === 'eventinfo' && <EventInfo key="eventinfo" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
