"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Star, Trophy, RefreshCw, Sparkles } from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

type BoxState = "closed" | "opening" | "open"

interface Box {
  id: number
  state: BoxState
  prize: string | null
  isWin: boolean
}

const PRIZES = [
  { label: "Chuyến du lịch 🏖️", isWin: true },
  { label: "Voucher 500K 🎟️", isWin: true },
  { label: "Tai nghe AirPods 🎧", isWin: true },
  { label: "Thử vận may lần sau 😅", isWin: false },
  { label: "Thử vận may lần sau 😅", isWin: false },
  { label: "Thử vận may lần sau 😅", isWin: false },
  { label: "Thử vận may lần sau 😅", isWin: false },
  { label: "Thử vận may lần sau 😅", isWin: false },
  { label: "Thử vận may lần sau 😅", isWin: false },
]

function createBoxes(): Box[] {
  const shuffled = [...PRIZES].sort(() => Math.random() - 0.5)
  return shuffled.map((p, i) => ({ id: i, state: "closed", prize: p.label, isWin: p.isWin }))
}

const MAX_TURNS = 3

export default function LuckyBoxGame() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start")
  const [boxes, setBoxes] = useState<Box[]>(createBoxes())
  const [turnsLeft, setTurnsLeft] = useState(MAX_TURNS)
  const [openedBoxes, setOpenedBoxes] = useState<Box[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [openingId, setOpeningId] = useState<number | null>(null)

  const handleStart = () => setScreen("game")

  const handleBoxClick = (box: Box) => {
    if (box.state !== "closed" || turnsLeft <= 0 || openingId !== null) return
    setOpeningId(box.id)
    setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, state: "opening" } : b))

    setTimeout(() => {
      setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, state: "open" } : b))
      setOpenedBoxes(prev => [...prev, box])
      setOpeningId(null)
      const newTurns = turnsLeft - 1
      setTurnsLeft(newTurns)
      if (box.isWin) setShowConfetti(true)
      if (newTurns === 0) setTimeout(() => setScreen("result"), 1200)
    }, 800)
  }

  const handleRestart = () => {
    setBoxes(createBoxes())
    setTurnsLeft(MAX_TURNS)
    setOpenedBoxes([])
    setShowConfetti(false)
    setOpeningId(null)
    setScreen("start")
  }

  const wins = openedBoxes.filter(b => b.isWin)

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={4000} />
      <AnimatePresence mode="wait">

        {/* START */}
        {screen === "start" && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center">
            <motion.div animate={{ y: [0, -16, 0], rotate: [0, -6, 6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mb-8 inline-block">
              <div className="w-36 h-36 mx-auto rounded-3xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 80px rgba(255,107,53,0.7), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                <Gift className="w-20 h-20 text-white" />
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
                {/* Ribbon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1.5 bg-white/40 rounded-full" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FFD700, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LUCKY BOX
            </h1>
            <p className="text-xl text-white/70 font-semibold mb-2">Hộp quà may mắn</p>
            <p className="text-white/50 mb-10">Chọn hộp để khám phá phần quà ẩn bên trong!</p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: Gift, label: "Hộp quà", value: "9", color: "#FF6B35" },
                { icon: Star, label: "Lượt chọn", value: MAX_TURNS, color: "#FFD700" },
                { icon: Trophy, label: "Giải thưởng", value: "3", color: "#B794F4" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <motion.button onClick={handleStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 40px rgba(255,107,53,0.5)" }}>
              <motion.div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25), transparent)" }}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="relative z-10 flex items-center gap-3 justify-center"><Gift className="w-6 h-6" />MỞ HỘP NGAY</span>
            </motion.button>
          </motion.div>
        )}

        {/* GAME */}
        {screen === "game" && (
          <motion.div key="game" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Còn lại</p>
                <div className="flex gap-2">
                  {Array.from({ length: MAX_TURNS }).map((_, i) => (
                    <motion.div key={i} animate={{ scale: i < turnsLeft ? 1 : 0.7 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: i < turnsLeft ? "linear-gradient(135deg, #FF6B35, #F7931E)" : "rgba(255,255,255,0.1)", boxShadow: i < turnsLeft ? "0 0 12px rgba(255,107,53,0.6)" : "none" }}>
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Đã mở</p>
                <p className="text-3xl font-black" style={{ color: "#FF6B35" }}>{MAX_TURNS - turnsLeft}<span className="text-white/30 text-xl">/{MAX_TURNS}</span></p>
              </div>
            </div>

            {/* Box grid */}
            <div className="grid grid-cols-3 gap-4">
              {boxes.map((box) => (
                <motion.button
                  key={box.id}
                  onClick={() => handleBoxClick(box)}
                  disabled={box.state !== "closed" || turnsLeft === 0 || openingId !== null}
                  whileHover={box.state === "closed" && turnsLeft > 0 ? { scale: 1.08, y: -6 } : {}}
                  whileTap={box.state === "closed" && turnsLeft > 0 ? { scale: 0.95 } : {}}
                  className="relative aspect-square rounded-2xl overflow-hidden"
                  style={{
                    background: box.state === "open"
                      ? box.isWin ? "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,53,0.15))" : "rgba(255,255,255,0.04)"
                      : "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(247,147,30,0.15))",
                    border: box.state === "open"
                      ? box.isWin ? "2px solid rgba(255,215,0,0.6)" : "2px solid rgba(255,255,255,0.1)"
                      : "2px solid rgba(255,107,53,0.4)",
                    backdropFilter: "blur(10px)",
                    cursor: box.state === "closed" && turnsLeft > 0 ? "pointer" : "default",
                    boxShadow: box.state === "closed" && turnsLeft > 0 ? "0 0 20px rgba(255,107,53,0.2)" : "none",
                  }}>

                  <AnimatePresence mode="wait">
                    {box.state === "closed" && (
                      <motion.div key="closed" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.5, rotate: 180 }} className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Gift className="w-10 h-10" style={{ color: "#FF6B35" }} />
                        <span className="text-white/40 text-xs font-semibold">Nhấn mở</span>
                        {/* Glow pulse */}
                        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                          animate={{ boxShadow: ["inset 0 0 20px rgba(255,107,53,0.1)", "inset 0 0 40px rgba(255,107,53,0.25)", "inset 0 0 20px rgba(255,107,53,0.1)"] }}
                          transition={{ duration: 2, repeat: Infinity }} />
                      </motion.div>
                    )}
                    {box.state === "opening" && (
                      <motion.div key="opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                        <motion.div animate={{ rotate: 360, scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                          <Sparkles className="w-10 h-10 text-[#FFD700]" />
                        </motion.div>
                      </motion.div>
                    )}
                    {box.state === "open" && (
                      <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.6 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center gap-2">
                        <motion.div animate={box.isWin ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.5 }}>
                          {box.isWin ? <Trophy className="w-10 h-10 text-[#FFD700]" /> : <span className="text-3xl">😅</span>}
                        </motion.div>
                        <p className="text-white text-[11px] font-semibold leading-tight">{box.prize}</p>
                        {box.isWin && (
                          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, transparent 70%)" }} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {turnsLeft === 0 && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-white/50 mt-6 text-sm">
                Đang tổng kết kết quả...
              </motion.p>
            )}
          </motion.div>
        )}

        {/* RESULT */}
        {screen === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1 }} className="mb-6">
              {wins.length > 0
                ? <div className="text-8xl mb-4">🎉</div>
                : <div className="text-8xl mb-4">🍀</div>
              }
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-2">
              {wins.length > 0 ? "Bạn thật may mắn!" : "Chúc bạn may mắn lần sau!"}
            </h1>
            <p className="text-white/50 mb-8">Đã mở {MAX_TURNS} hộp quà</p>

            <div className="space-y-3 mb-8">
              {openedBoxes.map((box, i) => (
                <motion.div key={box.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left"
                  style={{ background: box.isWin ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.1))" : "rgba(255,255,255,0.04)", border: box.isWin ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: box.isWin ? "linear-gradient(135deg, #FFD700, #FF6B35)" : "rgba(255,255,255,0.08)" }}>
                    {box.isWin ? <Trophy className="w-5 h-5 text-white" /> : <span className="text-lg">😅</span>}
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Hộp #{i + 1}</p>
                    <p className={`font-semibold ${box.isWin ? "text-[#FFD700]" : "text-white/60"}`}>{box.prize}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
              className="flex items-center gap-2 mx-auto px-10 py-4 rounded-full text-white font-bold"
              style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 30px rgba(255,107,53,0.4)" }}>
              <RefreshCw className="w-5 h-5" />Chơi lại
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}
