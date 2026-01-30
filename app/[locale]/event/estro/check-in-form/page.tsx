"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import GuestAuthForm from "@/components/GuestAuthForm"

// Success animation component
interface SuccessAnimationProps {
  guestName: string
}

function SuccessAnimation({ guestName }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.7 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#FFD700] to-[#FDB931] rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-20 h-20 text-black" />
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
            Check-in thành công!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-3xl text-white mb-4"
        >
          Chào mừng <span className="text-[#FFD700] font-bold">{guestName}</span> ✨
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// Main Check-in Form Page
export default function CheckInFormPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [guestName, setGuestName] = useState("")

  const handleSubmit = async (data: { type: 'phone' | 'code', value: string }) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set guest name
    const name = data.type === 'phone'
      ? `Khách ${data.value.slice(-4)}`
      : `Khách ${data.value}`

    setGuestName(name)
    setShowSuccess(true)

    // Fire massive confetti
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#FFD700', '#FDB931', '#FFFFFF', '#FF6B9D', '#C0C0C0', '#9C27FF']

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Redirect after 4 seconds
    setTimeout(() => {
      router.push(`/event/${eventId}/welcome`)
    }, 4000)

    setIsLoading(false)

    // TODO: Send to server/WebSocket
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1B0131] to-[#0A0A0A] overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6 text-[#FFD700]" />
          <span className="text-white font-bold text-lg">Bright4Event</span>
        </motion.div>
      </div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-[#1a1a1a]/95 to-[#0D0D1A]/95 border-2 border-[#FFD700]/40 rounded-3xl p-8 md:p-10 backdrop-blur-lg shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-3"
            >
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
                Check-in
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-lg"
            >
              GLOW UP 2025 - Year End Party
            </motion.p>
            <p className="text-[#FFD700] text-sm mt-1">Code4Change Media</p>
          </div>

          {/* Guest Auth Form Component */}
          <GuestAuthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            showToggle={true}
            defaultType="phone"
            buttonText="Check-in ngay"
          />

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-500 text-sm mt-6 text-center"
          >
            Gặp vấn đề? Liên hệ ban tổ chức tại quầy lễ tân
          </motion.p>
        </div>
      </motion.div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && <SuccessAnimation guestName={guestName} />}
      </AnimatePresence>
    </div>
  )
}
