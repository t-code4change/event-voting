"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"
import {
  Sparkles, MapPin, Clock, Star, Gift, Users
} from "lucide-react"

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FFD700]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
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

// Spotlight beams
function SpotlightBeams() {
  return (
    <>
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
            'linear-gradient(135deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
            'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
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
    // Fire confetti
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF']
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF']
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
            className="block bg-gradient-to-r !leading-[1.2] from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent"
            animate={{
              textShadow: [
                '0 0 20px rgba(255, 215, 0, 0.3)',
                '0 0 40px rgba(255, 215, 0, 0.6)',
                '0 0 20px rgba(255, 215, 0, 0.3)',
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
            ✨
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-3xl text-gray-300 mb-8"
        >
          Đã check-in thành công tại <span className="text-[#FFD700]">Year End Party 2025</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 italic max-w-3xl mx-auto"
        >
          "Mỗi khoảnh khắc bạn có mặt đều góp phần tạo nên đêm rực rỡ này."
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
      text: "Together We Create. Together We Shine.",
      subtext: "Code4Change Media"
    },
    {
      image: "/gallery/event-2.jpg",
      text: "Bright4Event – Light up your event",
      subtext: "Nền tảng sự kiện All-in-One"
    },
    {
      image: "/gallery/event-3.jpg",
      text: "Code4Change – Bứt phá cùng công nghệ & sáng tạo",
      subtext: "Year End Party 2025"
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
              className="text-2xl md:text-3xl text-[#FFD700] font-semibold"
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
    { icon: Clock, title: "Thời gian", value: "19:00 - 23:00 | 28/12/2025" },
    { icon: MapPin, title: "Địa điểm", value: "GEM Center, Quận 1, TP.HCM" },
    { icon: Star, title: "Dress Code", value: "Sparkle Gold & Black" },
    { icon: Gift, title: "Lucky Draw", value: "Giờ vàng 21:00 - Quà hấp dẫn" },
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
            className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#0D0D1A]/90 border-2 border-[#FFD700]/30 rounded-3xl p-8 backdrop-blur-sm"
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-2xl flex items-center justify-center mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <item.icon className="w-8 h-8 text-black" />
            </motion.div>
            <h3 className="text-2xl font-bold text-[#FFD700] mb-2">{item.title}</h3>
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
  const [guestCount, setGuestCount] = useState(100)
  const idleTimerRef = useRef<NodeJS.Timeout>()

  // Simulate check-in (replace with real WebSocket connection)
  useEffect(() => {
    // Example: Simulate a guest checking in after 3 seconds
    const demoTimer = setTimeout(() => {
      handleGuestCheckIn("Tony Nguyen")
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#000000] via-[#0D0D1A] to-[#1a1a1a] overflow-hidden">
      {/* Background effects */}
      <SpotlightBeams />
      <FloatingParticles />

      {/* Logos */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-8 h-8 text-[#FFD700]" />
          <span className="text-2xl font-bold text-white">Bright4Event</span>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-right"
        >
          <div className="text-2xl font-bold text-[#FFD700]">GLOW UP 2025</div>
          <div className="text-sm text-gray-400">Code4Change Media</div>
        </motion.div>
      </div>

      {/* Guest counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a]/80 border-2 border-[#FFD700]/30 rounded-full backdrop-blur-sm">
          <Users className="w-6 h-6 text-[#FFD700]" />
          <span className="text-white text-lg">
            Đã có <span className="text-[#FFD700] font-bold">{guestCount}</span> khách tham dự 🎉
          </span>
        </div>
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
