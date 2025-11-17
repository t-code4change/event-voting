"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import confetti from "canvas-confetti"
import { Sparkles } from "lucide-react"

// Floating particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#FFD700]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Main QR Code Display Page
export default function CheckInPage() {
  const params = useParams()
  const eventId = params.eventId as string

  // Generate check-in form URL
  const checkInFormUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${eventId}/check-in-form`
    : ''

  // Fire confetti on page load
  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FDB931', '#FFFFFF', '#FF6B9D', '#C0C0C0']
      })
    }, 500)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1B0131] to-[#0A0A0A] overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <FloatingParticles />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-7 h-7 text-[#FFD700]" />
          <span className="text-white font-bold text-xl">Bright4Event</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">

        {/* Event Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            animate={{
              textShadow: [
                '0 0 20px rgba(255, 215, 0, 0.5)',
                '0 0 40px rgba(255, 215, 0, 0.9)',
                '0 0 20px rgba(255, 215, 0, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
              GLOW UP 2025
            </span>
          </motion.h1>
          <p className="text-2xl md:text-3xl text-white font-semibold">Year End Party</p>
        </motion.div>

        {/* QR Code Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <div className="relative inline-block">
            {/* QR Code with pulsing glow */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255, 215, 0, 0.6)',
                  '0 0 60px rgba(255, 215, 0, 1)',
                  '0 0 30px rgba(255, 215, 0, 0.6)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-white p-8 rounded-3xl inline-block"
            >
              {checkInFormUrl && (
                <QRCodeSVG
                  value={checkInFormUrl}
                  size={320}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/logo.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              )}
            </motion.div>

            {/* Animated border */}
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 border-4 border-[#FFD700] rounded-3xl pointer-events-none"
            />

            {/* Corner sparkles */}
            {[
              { top: -12, left: -12 },
              { top: -12, right: -12 },
              { bottom: -12, left: -12 },
              { bottom: -12, right: -12 },
            ].map((position, index) => (
              <motion.div
                key={index}
                className="absolute w-6 h-6 text-[#FFD700]"
                style={position}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-3xl md:text-4xl text-white font-bold mb-4">
            Quét mã để check-in sự kiện ✨
          </p>
          <p className="text-xl text-gray-300">
            Chào mừng bạn đến với đêm tiệc Glow Up 2025!
          </p>
        </motion.div>

        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 text-gray-400"
        >
          <p className="text-lg">Code4Change Media</p>
          <p>28/12/2025 | GEM Center, TP.HCM</p>
        </motion.div>
      </div>
    </div>
  )
}
