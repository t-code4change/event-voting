"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Star, Trophy, Sparkles } from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

interface LuckyBoxGameProps {
  onComplete?: (score: number, total: number) => void
}

type BoxState = "closed" | "opening" | "open"

interface Box {
  id: number
  state: BoxState
  prize: string
  isWin: boolean
}

const ALL_PRIZES = [
  { label: "Chuyến du lịch 🏖️", isWin: true },
  { label: "Voucher 500K 🎟️", isWin: true },
  { label: "Tai nghe AirPods 🎧", isWin: true },
  { label: "Thử lại lần sau 😅", isWin: false },
  { label: "Thử lại lần sau 😅", isWin: false },
  { label: "Thử lại lần sau 😅", isWin: false },
  { label: "Thử lại lần sau 😅", isWin: false },
  { label: "Thử lại lần sau 😅", isWin: false },
  { label: "Thử lại lần sau 😅", isWin: false },
]

const MAX_TURNS = 3

function createBoxes(): Box[] {
  return [...ALL_PRIZES].sort(() => Math.random() - 0.5).map((p, i) => ({ id: i, state: "closed", prize: p.label, isWin: p.isWin }))
}

export default function LuckyBoxGame({ onComplete }: LuckyBoxGameProps) {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start")
  const [boxes, setBoxes] = useState<Box[]>(createBoxes())
  const [turnsLeft, setTurnsLeft] = useState(MAX_TURNS)
  const [openedBoxes, setOpenedBoxes] = useState<Box[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [openingId, setOpeningId] = useState<number | null>(null)

  const handleStart = () => { setScreen("game") }

  const handleBoxClick = (box: Box) => {
    if (box.state !== "closed" || turnsLeft <= 0 || openingId !== null) return
    setOpeningId(box.id)
    setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, state: "opening" } : b))

    setTimeout(() => {
      const newBoxes = boxes.map(b => b.id === box.id ? { ...b, state: "open" as BoxState } : b)
      setBoxes(newBoxes)
      const newOpened = [...openedBoxes, box]
      setOpenedBoxes(newOpened)
      setOpeningId(null)
      const newTurns = turnsLeft - 1
      setTurnsLeft(newTurns)
      if (box.isWin) setShowConfetti(true)
      if (newTurns === 0) {
        setTimeout(() => {
          setScreen("result")
          const wins = newOpened.filter(b => b.isWin).length
          onComplete?.(wins, MAX_TURNS)
        }, 1000)
      }
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

        {/* ═══ START ═══ */}
        {screen === "start" && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg w-full text-center px-5">
            <motion.div animate={{ y: [0, -16, 0], rotate: [0, -6, 6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mb-8 inline-block">
              <div className="w-36 h-36 mx-auto rounded-3xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 80px rgba(255,107,53,0.7), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                <Gift className="w-20 h-20 text-white" />
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
                {/* Ribbon cross */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl font-black mb-3 tracking-tight"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FFD700, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LUCKY BOX
            </h1>
            <p className="text-xl text-white/70 font-semibold mb-2">Hộp quà may mắn</p>
            <p className="text-white/50 mb-10">Chọn hộp bí ẩn — may mắn đang chờ bạn!</p>

            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { icon: Gift, label: "Hộp quà", value: "9", color: "#FF6B35" },
                { icon: Star, label: "Lượt chọn", value: MAX_TURNS, color: "#FFD700" },
                { icon: Trophy, label: "Giải thưởng", value: "3", color: "#B794F4" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <motion.button onClick={handleStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 40px rgba(255,107,53,0.5)" }}>
              <motion.div className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25), transparent)" }}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Gift className="w-6 h-6" />MỞ HỘP NGAY
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* ═══ GAME ═══ */}
        {screen === "game" && (
          <motion.div key="game" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-2xl px-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Lượt còn lại</p>
                <div className="flex gap-2">
                  {Array.from({ length: MAX_TURNS }).map((_, i) => (
                    <motion.div key={i} animate={{ scale: i < turnsLeft ? 1 : 0.75, opacity: i < turnsLeft ? 1 : 0.35 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: i < turnsLeft ? "linear-gradient(135deg, #FF6B35, #F7931E)" : "rgba(255,255,255,0.08)",
                        boxShadow: i < turnsLeft ? "0 0 14px rgba(255,107,53,0.6)" : "none",
                      }}>
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Đã mở</p>
                <p className="text-3xl font-black" style={{ color: "#FF6B35" }}>
                  {MAX_TURNS - turnsLeft}<span className="text-white/25 text-xl">/{MAX_TURNS}</span>
                </p>
              </div>
            </div>

            {/* Box grid — use inline style for aspect ratio to avoid Tailwind purge */}
            <div className="grid grid-cols-3 gap-4">
              {boxes.map((box) => (
                <div key={box.id} className="relative w-full" style={{ paddingBottom: "100%" }}>
                  <motion.button
                    onClick={() => handleBoxClick(box)}
                    disabled={box.state !== "closed" || turnsLeft === 0 || openingId !== null}
                    whileHover={box.state === "closed" && turnsLeft > 0 ? { scale: 1.07, y: -6 } : {}}
                    whileTap={box.state === "closed" && turnsLeft > 0 ? { scale: 0.94 } : {}}
                    className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
                    style={{
                      background: box.state === "open"
                        ? box.isWin ? "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,53,0.15))" : "rgba(255,255,255,0.04)"
                        : "linear-gradient(135deg, rgba(255,107,53,0.22), rgba(247,147,30,0.15))",
                      border: box.state === "open"
                        ? box.isWin ? "2px solid rgba(255,215,0,0.65)" : "2px solid rgba(255,255,255,0.1)"
                        : "2px solid rgba(255,107,53,0.45)",
                      backdropFilter: "blur(10px)",
                      boxShadow: box.state === "closed" && turnsLeft > 0 ? "0 0 20px rgba(255,107,53,0.2)" : "none",
                      cursor: box.state === "closed" && turnsLeft > 0 ? "pointer" : "default",
                    }}>

                    <AnimatePresence mode="wait">
                      {/* CLOSED */}
                      {box.state === "closed" && (
                        <motion.div key="closed" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
                          className="flex flex-col items-center gap-2">
                          <Gift className="w-10 h-10" style={{ color: "#FF6B35" }} />
                          <span className="text-white/50 text-xs font-semibold">Nhấn mở</span>
                          <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={{ boxShadow: ["inset 0 0 16px rgba(255,107,53,0.08)", "inset 0 0 32px rgba(255,107,53,0.22)", "inset 0 0 16px rgba(255,107,53,0.08)"] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        </motion.div>
                      )}

                      {/* OPENING */}
                      {box.state === "opening" && (
                        <motion.div key="opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center justify-center">
                          <motion.div animate={{ rotate: 360, scale: [1, 1.5, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
                            <Sparkles className="w-12 h-12 text-yellow-400" />
                          </motion.div>
                        </motion.div>
                      )}

                      {/* OPEN */}
                      {box.state === "open" && (
                        <motion.div key="open" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", duration: 0.5 }}
                          className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                          <motion.div animate={box.isWin ? { rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.5 }}>
                            {box.isWin ? <Trophy className="w-10 h-10 text-yellow-400" /> : <span className="text-3xl">😅</span>}
                          </motion.div>
                          <p className="text-white text-xs font-semibold leading-snug">{box.prize}</p>
                          {box.isWin && (
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{ background: "radial-gradient(ellipse at center, rgba(255,215,0,0.18) 0%, transparent 70%)" }} />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              ))}
            </div>

            {turnsLeft === 0 && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-white/40 mt-6 text-sm">
                Đang tổng kết...
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {screen === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg w-full text-center px-5">

            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1 }} className="mb-6">
              <div className="text-8xl mb-4">{wins.length > 0 ? "🎉" : "🍀"}</div>
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-2">
              {wins.length > 0 ? `Bạn thật may mắn!` : "Chúc may mắn lần sau!"}
            </h1>
            {wins.length > 0 && (
              <p className="text-yellow-400 font-bold mb-2">Trúng {wins.length} phần quà!</p>
            )}
            <p className="text-white/50 mb-8">Đã mở {MAX_TURNS} hộp quà</p>

            <div className="space-y-3 mb-8">
              {openedBoxes.map((box, i) => (
                <motion.div key={box.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left"
                  style={{
                    background: box.isWin ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.1))" : "rgba(255,255,255,0.04)",
                    border: box.isWin ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: box.isWin ? "linear-gradient(135deg, #FFD700, #FF6B35)" : "rgba(255,255,255,0.08)" }}>
                    {box.isWin ? <Trophy className="w-5 h-5 text-white" /> : <span className="text-lg">😅</span>}
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Hộp #{i + 1}</p>
                    <p className="font-semibold" style={{ color: box.isWin ? "#FFD700" : "rgba(255,255,255,0.55)" }}>{box.prize}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
              className="flex items-center gap-2 mx-auto px-10 py-4 rounded-full text-white font-bold"
              style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)", boxShadow: "0 0 30px rgba(255,107,53,0.4)" }}>
              Chơi lại
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}
