"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Gift,
  Play,
  Eye,
  ExternalLink,
  Trophy,
  Award,
  Medal,
  Plus,
  History,
} from "lucide-react"

const prizes = [
  { id: 1, name: "Giải Nhất", value: "iPhone 15 Pro Max", icon: Trophy, color: "#FFD700" },
  { id: 2, name: "Giải Nhì", value: "iPad Air", icon: Award, color: "#C0C0C0" },
  { id: 3, name: "Giải Ba", value: "AirPods Pro", icon: Medal, color: "#CD7F32" },
  { id: 4, name: "Giải Khuyến Khích", value: "Voucher 500K", icon: Gift, color: "#A855F7" },
]

const winners = [
  { id: 1, name: "Nguyễn Văn A", prize: "iPhone 15 Pro Max", time: "2 phút trước" },
  { id: 2, name: "Trần Thị B", prize: "iPad Air", time: "5 phút trước" },
  { id: 3, name: "Lê Văn C", prize: "AirPods Pro", time: "8 phút trước" },
]

export default function LuckyDrawModule() {
  const [selectedPrize, setSelectedPrize] = useState(prizes[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState("")
  const [showWinner, setShowWinner] = useState(false)
  const [spinCount, setSpinCount] = useState(0)

  const handleSpin = () => {
    setIsSpinning(true)
    setShowWinner(false)
    setWinner("")

    // Simulate spinning for 3 seconds
    setTimeout(() => {
      const mockWinner = `Nguyễn Văn ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
      setWinner(mockWinner)
      setIsSpinning(false)
      setShowWinner(true)
      setSpinCount(spinCount + 1)

      // Confetti burst
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFC107', '#FFFFFF'],
        })
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFC107', '#FFFFFF'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gift className="w-8 h-8 text-[#FFD700]" />
            Lucky Draw
          </h1>
          <p className="text-white/60 mt-2">Quay số trúng thưởng may mắn</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20">
            <span className="text-sm text-white/60">Đã quay: </span>
            <span className="text-lg font-bold text-[#FFD700]">{spinCount}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700] text-black font-semibold hover:bg-[#FFC107]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Lucky Draw Screen
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left: Prize Selection */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
              Chọn Giải Thưởng
            </h2>

            <div className="space-y-3">
              {prizes.map((prize) => {
                const Icon = prize.icon
                return (
                  <motion.button
                    key={prize.id}
                    onClick={() => setSelectedPrize(prize)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPrize.id === prize.id
                        ? 'border-[#FFD700] bg-[#FFD700]/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className="w-8 h-8"
                        style={{ color: prize.color }}
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-white">{prize.name}</p>
                        <p className="text-xs text-white/60">{prize.value}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Thêm Giải Thưởng
              </motion.button>
            </div>
          </div>

          {/* Winners History */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-[#FFD700]" />
              Lịch Sử Trúng Thưởng
            </h2>

            <div className="space-y-3">
              {winners.map((w, index) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{w.name}</p>
                      <p className="text-xs text-white/60">{w.prize}</p>
                    </div>
                    <span className="text-xs text-white/40">{w.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Lucky Draw Display */}
        <div className="col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-[#FFD700]" />
                Lucky Draw Screen
              </h2>
              <span className="text-sm text-white/60">{selectedPrize.name}</span>
            </div>

            {/* Lucky Draw Preview */}
            <div className="relative aspect-video rounded-xl bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -50, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Prize Display */}
              <div className="absolute top-8 left-0 right-0 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <selectedPrize.icon
                    className="w-20 h-20 mx-auto mb-4"
                    style={{ color: selectedPrize.color, filter: `drop-shadow(0 0 20px ${selectedPrize.color})` }}
                  />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent mb-2">
                    {selectedPrize.name}
                  </h2>
                  <p className="text-2xl text-white/80">{selectedPrize.value}</p>
                </motion.div>
              </div>

              {/* Rolling Number Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isSpinning ? (
                    <motion.div
                      key="spinning"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="text-center"
                    >
                      {/* Jackpot-style rolling numbers */}
                      <div className="flex gap-4 justify-center mb-8">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-16 h-24 rounded-xl bg-black/50 border-2 border-[#FFD700] flex items-center justify-center overflow-hidden"
                            animate={{
                              borderColor: ['#FFD700', '#FFC107', '#FFD700'],
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            <motion.div
                              animate={{
                                y: [0, -2400],
                              }}
                              transition={{
                                duration: 3,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                              className="text-6xl font-bold text-[#FFD700] tabular-nums"
                            >
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <div key={num} className="h-24 flex items-center justify-center">
                                  {num}
                                </div>
                              ))}
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-2xl text-white/80"
                      >
                        Đang quay số...
                      </motion.p>
                    </motion.div>
                  ) : showWinner ? (
                    <motion.div
                      key="winner"
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 0.5, repeat: 3 }}
                      >
                        <Trophy className="w-32 h-32 mx-auto mb-6 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 30px #FFD700)' }} />
                      </motion.div>
                      <h2 className="text-6xl font-bold bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent mb-4">
                        CHÚC MỪNG!
                      </h2>
                      <p className="text-5xl text-white font-bold mb-2">{winner}</p>
                      <p className="text-2xl text-white/60">đã trúng {selectedPrize.name}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <p className="text-3xl text-white/60">Sẵn sàng quay số</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Spin Button */}
            <div className="mt-6 text-center">
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning}
                whileHover={{ scale: isSpinning ? 1 : 1.05 }}
                whileTap={{ scale: isSpinning ? 1 : 0.95 }}
                className={`relative px-12 py-4 rounded-xl font-bold text-xl transition-all overflow-hidden ${
                  isSpinning
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black hover:shadow-lg hover:shadow-[#FFD700]/50'
                }`}
              >
                {!isSpinning && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  {isSpinning ? 'Đang quay...' : 'QUAY SỐ NGAY'}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
