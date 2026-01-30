"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { CreditCard, CheckCircle, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import Image from "next/image"

// Brand colors - ESTRON
const BRAND_COLORS = {
  primary: '#CC0000',    // Red
  secondary: '#009933',  // Green
  accent: '#FF3333',
  gold: '#FFD700',
}

// Success Animation Component - Simple version
interface SuccessAnimationProps {
  guestName: string
}

function SuccessAnimation({ guestName }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0A0A0A]/98 via-[#1A0A0A]/98 to-[#0A0A0A]/98 backdrop-blur-xl z-50 flex items-center justify-center px-4"
    >
      {/* Rotating halo effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 bg-gradient-to-r from-[#CC0000]/30 via-[#009933]/30 to-[#CC0000]/30 rounded-full blur-3xl"
      />

      {/* Sparkles in corners */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: i < 2 ? '10%' : 'auto',
            bottom: i >= 2 ? '10%' : 'auto',
            left: i % 2 === 0 ? '10%' : 'auto',
            right: i % 2 === 1 ? '10%' : 'auto',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <Sparkles className="w-8 h-8 text-[#FFD700]" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(0, 153, 51, 0.5)',
                '0 0 60px rgba(0, 153, 51, 0.8)',
                '0 0 30px rgba(0, 153, 51, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-[#009933] to-[#00CC44] rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl font-black mb-4 tracking-wider"
        >
          <span className="text-transparent bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text">
            CHECK-IN THÀNH CÔNG!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-white/90 mb-2 font-semibold tracking-wide"
        >
          Chào mừng <span className="text-[#FFD700] font-bold">{guestName}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-[#009933] mb-4 font-medium"
        >
          đến với Year End Party 2026
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 text-base"
        >
          <p className="font-semibold text-[#CC0000]">ESTRON VIETNAM</p>
          <p className="text-sm mt-1">Xoắn chặt kết nối, Mở lối tương lai</p>
        </motion.div>

        {/* Auto redirect message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/40 text-sm mt-8"
        >
          Chúc bạn có một buổi tiệc vui vẻ! 🎉
        </motion.p>
      </div>
    </motion.div>
  )
}

// Main Check-in Form Page
export default function CheckInFormPage() {
  const params = useParams()
  const locale = params.locale as string

  const [employeeId, setEmployeeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (employeeId.length < 3) {
      setError("Vui lòng nhập mã nhân viên hợp lệ")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Call API to check-in
      // const response = await fetch(`/api/events/estro/check-in`, {
      //   method: 'POST',
      //   body: JSON.stringify({ code: employeeId })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // TODO: Get actual guest name from API response
      setGuestName(`Nhân viên ${employeeId}`)
      setShowSuccess(true)

      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration
      const colors = ['#CC0000', '#009933', '#FFD700', '#FFFFFF']

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.6 },
          colors: colors,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.6 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()

    } catch {
      setError("Mã nhân viên không tồn tại. Vui lòng kiểm tra lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? BRAND_COLORS.primary : BRAND_COLORS.secondary,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo - Top Right */}
      <div className="absolute top-6 right-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Image
            src="/estro/logo.png"
            alt="ESTRON"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </motion.div>
      </div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#CC0000]/40 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl">

          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#CC0000]/20 via-[#009933]/20 to-[#CC0000]/20 rounded-3xl blur-2xl -z-10" />

          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black mb-4 tracking-wider relative"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(204, 0, 0, 0.4))'
              }}
            >
              <span className="text-transparent bg-gradient-to-r from-[#CC0000] via-[#FF3333] to-[#CC0000] bg-clip-text">
                CHECK-IN
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg font-semibold mb-1"
            >
              Year End Party 2026
            </motion.p>
            <p className="text-[#009933] text-sm font-medium">ESTRON VIETNAM</p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Employee ID Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white font-bold mb-3 text-lg tracking-wide">
                Mã nhân viên <span className="text-[#CC0000]">*</span>
              </label>

              {/* Input with breathing animation */}
              <div className="relative">
                {/* Breathing glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.015, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#CC0000]/50 via-[#009933]/50 to-[#CC0000]/50 rounded-2xl blur-md"
                />

                {/* Glassmorphism input */}
                <div className="relative flex items-center">
                  <div className="absolute left-5 pointer-events-none z-10">
                    <CreditCard className="w-5 h-5 text-[#CC0000]/70" />
                  </div>

                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value.toUpperCase())
                      setError("")
                    }}
                    placeholder="Nhập mã nhân viên…"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl uppercase font-semibold text-lg focus:outline-none transition-all bg-white/10 border border-white/30 backdrop-blur-lg text-white placeholder:text-white/50"
                    style={{
                      caretColor: BRAND_COLORS.primary,
                    }}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#FF3333] text-sm mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={!isLoading ? {
                scale: 1.02,
                boxShadow: "0 0 30px rgba(204, 0, 0, 0.7), 0 0 60px rgba(204, 0, 0, 0.4)"
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-6 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-widest font-black text-xl md:text-2xl text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 50%, ${BRAND_COLORS.primary} 100%)`,
                boxShadow: '0 10px 40px rgba(204, 0, 0, 0.4), 0 0 20px rgba(204, 0, 0, 0.3)',
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                  />
                  <span>ĐANG XỬ LÝ...</span>
                </>
              ) : (
                <span>✓ CHECK-IN NGAY</span>
              )}
            </motion.button>
          </motion.form>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/50 text-sm mt-8 text-center font-medium"
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
