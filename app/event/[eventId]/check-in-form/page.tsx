"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Sparkles, Phone, Ticket } from "lucide-react"
import confetti from "canvas-confetti"

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

  const [inputType, setInputType] = useState<'phone' | 'code'>('phone')
  const [phoneNumber, setPhoneNumber] = useState("")
  const [invitationCode, setInvitationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [guestName, setGuestName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (inputType === 'phone' && phoneNumber.length < 10) {
      alert("Vui lòng nhập số điện thoại hợp lệ")
      setIsLoading(false)
      return
    }

    if (inputType === 'code' && invitationCode.length < 4) {
      alert("Vui lòng nhập mã mời hợp lệ")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set guest name
    const name = inputType === 'phone'
      ? `Khách ${phoneNumber.slice(-4)}`
      : `Khách ${invitationCode}`

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

          {/* Toggle Input Type */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mb-6"
          >
            <button
              onClick={() => setInputType('phone')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                inputType === 'phone'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black'
                  : 'bg-[#0D0D1A] text-gray-400 border border-[#FFD700]/30 hover:border-[#FFD700]/60'
              }`}
            >
              <Phone className="w-5 h-5 inline mr-2" />
              Số điện thoại
            </button>
            <button
              onClick={() => setInputType('code')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                inputType === 'code'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black'
                  : 'bg-[#0D0D1A] text-gray-400 border border-[#FFD700]/30 hover:border-[#FFD700]/60'
              }`}
            >
              <Ticket className="w-5 h-5 inline mr-2" />
              Mã mời
            </button>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Phone Number Input */}
            {inputType === 'phone' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <label className="block text-white font-semibold mb-2 text-lg">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                  className="w-full px-5 py-4 bg-[#0D0D1A] border-2 border-[#FFD700]/40 rounded-xl text-white text-lg placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 focus:outline-none transition-all"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </motion.div>
            )}

            {/* Invitation Code Input */}
            {inputType === 'code' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <label className="block text-white font-semibold mb-2 text-lg">
                  Mã mời <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã mời từ email"
                  className="w-full px-5 py-4 bg-[#0D0D1A] border-2 border-[#FFD700]/40 rounded-xl text-white text-lg placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 focus:outline-none transition-all uppercase"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-5 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold text-xl rounded-xl hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-black border-t-transparent rounded-full"
                  />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>✅ Check-in ngay</span>
              )}
            </motion.button>
          </motion.form>

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
