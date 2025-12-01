"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { CreditCard, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

// Slot Machine Component for Reward Code
interface SlotMachineProps {
  finalCode: string
  onComplete: () => void
}

function SlotMachine({ finalCode, onComplete }: SlotMachineProps) {
  const [displayChars, setDisplayChars] = useState(['', '', '', ''])
  const [isRolling, setIsRolling] = useState(true)

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const finalChars = finalCode.split('')

    // Rolling animation for each slot
    const intervals: NodeJS.Timeout[] = []

    finalChars.forEach((finalChar, index) => {
      let count = 0
      const maxCount = 20 + index * 5 // Each slot stops progressively

      const interval = setInterval(() => {
        if (count < maxCount) {
          setDisplayChars(prev => {
            const newChars = [...prev]
            newChars[index] = chars[Math.floor(Math.random() * chars.length)]
            return newChars
          })
          count++
        } else {
          setDisplayChars(prev => {
            const newChars = [...prev]
            newChars[index] = finalChar
            return newChars
          })
          clearInterval(interval)

          // All slots stopped
          if (index === finalChars.length - 1) {
            setTimeout(() => {
              setIsRolling(false)
              onComplete()
            }, 300)
          }
        }
      }, 50)

      intervals.push(interval)
    })

    return () => intervals.forEach(clearInterval)
  }, [finalCode, onComplete])

  return (
    <div className="flex gap-3 justify-center mb-8">
      {displayChars.map((char, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          className="relative"
        >
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F2C94C]/50 to-[#00E0FF]/50 rounded-2xl blur-xl animate-pulse" />

          {/* Slot box */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-[#F2C94C]/40 rounded-2xl flex items-center justify-center shadow-2xl">
            <motion.span
              key={char}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-4xl md:text-5xl font-black ${isRolling ? 'text-white/70' : 'text-transparent bg-gradient-to-br from-[#F2C94C] via-[#FFD700] to-[#00E0FF] bg-clip-text'
                }`}
              style={{ fontFamily: 'Bebas Neue, Oswald, sans-serif' }}
            >
              {char || '?'}
            </motion.span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Reward Reveal Component
interface RewardRevealProps {
  rewardCode: string
  guestName: string
  onComplete: () => void
}

function RewardReveal({ rewardCode, guestName, onComplete }: RewardRevealProps) {
  const [showCode, setShowCode] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Fire premium gold confetti
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#F2C94C', '#FFD700', '#FDB931', '#FFFFFF', '#00E0FF']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
        gravity: 0.5,
        drift: 0.2,
        ticks: 200
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
        gravity: 0.5,
        drift: -0.2,
        ticks: 200
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Show messages sequentially
    setTimeout(() => setShowCode(true), 500)
    setTimeout(() => setShowMessage(true), 1500)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0A0A0A]/98 via-[#1A1F3D]/98 to-[#0A0A0A]/98 backdrop-blur-xl z-50 flex items-center justify-center px-4"
    >
      {/* Rotating halo effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 bg-gradient-to-r from-[#F2C94C]/30 via-[#6A4BFF]/30 to-[#00E0FF]/30 rounded-full blur-3xl"
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
          <Sparkles className="w-8 h-8 text-[#F2C94C]" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        {/* Slot Machine Animation */}
        <AnimatePresence mode="wait">
          {showCode && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <SlotMachine
                finalCode={rewardCode}
                onComplete={() => { }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showMessage && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-4xl md:text-6xl font-black mb-4 tracking-wider"
                style={{ fontFamily: 'Bebas Neue, Oswald, sans-serif' }}
              >
                <span className="text-transparent bg-gradient-to-r from-[#F2C94C] via-[#FFD700] to-[#00E0FF] bg-clip-text">
                  CHÚC MỪNG!
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-white/90 mb-2 font-semibold tracking-wide"
              >
                Đây là mã nhận thưởng của bạn
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-[#F2C94C] mb-8 font-medium"
              >
                Chào mừng {guestName} đến với Hoiana Year-End Party 2025
              </motion.p>

              {/* Complete Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-12 py-4 bg-gradient-to-r from-[#F2C94C] via-[#FFD700] to-[#00E0FF] text-[#1A1F3D] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-[#F2C94C]/50 transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Hoàn tất
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Main Check-in Form Page
export default function CheckInFormPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const router = useRouter()

  const [employeeId, setEmployeeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [rewardCode, setRewardCode] = useState("")
  const [guestName, setGuestName] = useState("")

  // Generate random 4-character code
  const generateRewardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (employeeId.length < 3) {
      alert("Vui lòng nhập mã nhân viên hợp lệ")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate reward code and show animation
    const code = generateRewardCode()
    setRewardCode(code)
    setGuestName(`NV ${employeeId}`)
    setShowReward(true)

    setIsLoading(false)

    // TODO: Send to server/WebSocket
  }

  const handleComplete = () => {
    router.push(`/event/${eventId}/welcome`)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1F3D] to-[#0A0A0A] overflow-hidden flex items-center justify-center px-4 py-12">

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
              background: i % 3 === 0
                ? '#F2C94C'
                : i % 3 === 1
                  ? '#00E0FF'
                  : '#6A4BFF',
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

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6 text-[#F2C94C]" />
          <span className="text-white font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            HOIANA
          </span>
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
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#F2C94C]/40 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl">

          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F2C94C]/20 via-[#6A4BFF]/20 to-[#00E0FF]/20 rounded-3xl blur-2xl -z-10" />

          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black mb-4 tracking-wider relative"
              style={{
                fontFamily: 'Bebas Neue, Oswald, sans-serif',
                filter: 'drop-shadow(0 0 20px rgba(242, 201, 76, 0.4))'
              }}
            >
              <span className="text-transparent bg-gradient-to-r from-[#F2C94C] via-[#FFD700] to-[#00E0FF] bg-clip-text">
                CHECK-IN
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg font-semibold mb-1"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Year-End Party 2025
            </motion.p>
            <p className="text-[#F2C94C] text-sm font-medium">Hoiana Resort & Golf</p>
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
              <label
                className="block text-white font-bold mb-3 text-lg tracking-wide"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.02em'
                }}
              >
                Mã nhân viên <span className="text-[#00E0FF]">*</span>
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
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#F2C94C]/50 via-[#00E0FF]/50 to-[#6A4BFF]/50 rounded-2xl blur-md"
                />

                {/* Glassmorphism input */}
                <div className="relative flex items-center">
                  <div className="absolute left-5 pointer-events-none z-10">
                    <CreditCard className="w-5 h-5 text-[#F2C94C]/70" />
                  </div>

                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    placeholder="Nhập mã nhân viên…"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl uppercase font-semibold text-lg focus:outline-none transition-all"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      backdropFilter: 'blur(10px)',
                      color: '#FFFFFFEE',
                      caretColor: '#F2C94C',
                    }}
                    required
                    disabled={isLoading}
                    autoFocus
                  />

                  <style jsx>{`
                    input::placeholder {
                      color: rgba(255, 255, 255, 0.5);
                      font-weight: 500;
                    }
                    input:focus {
                      border-color: rgba(242, 201, 76, 0.7);
                      box-shadow: 0 0 0 3px rgba(242, 201, 76, 0.15);
                    }
                    input:disabled {
                      opacity: 0.6;
                      cursor: not-allowed;
                    }
                  `}</style>
                </div>
              </div>
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
                boxShadow: "0 0 30px rgba(242, 201, 76, 0.7), 0 0 60px rgba(242, 201, 76, 0.4)"
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-6 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-widest font-black text-xl md:text-2xl"
              style={{
                fontFamily: 'Bebas Neue, Oswald, sans-serif',
                background: 'linear-gradient(135deg, #F2C94C 0%, #FFD700 50%, #00E0FF 100%)',
                color: '#1A1F3D',
                boxShadow: '0 10px 40px rgba(242, 201, 76, 0.4), 0 0 20px rgba(242, 201, 76, 0.3)',
                letterSpacing: '0.08em'
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-[#1A1F3D] border-t-transparent rounded-full"
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
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Gặp vấn đề? Liên hệ ban tổ chức tại quầy lễ tân
          </motion.p>
        </div>
      </motion.div>

      {/* Reward Reveal Overlay */}
      <AnimatePresence>
        {showReward && (
          <RewardReveal
            rewardCode={rewardCode}
            guestName={guestName}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
