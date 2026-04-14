"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Target, Trophy, RefreshCw, Timer } from "lucide-react"

const ROUNDS = 8
const MIN_DELAY = 800
const MAX_DELAY = 2800

interface Round {
  reactionMs: number | null
  missed: boolean
}

function getRating(avgMs: number) {
  if (avgMs < 200) return { label: "SIÊU NHANH ⚡", color: "#FFD700", desc: "Phản xạ đỉnh cao!" }
  if (avgMs < 350) return { label: "NHANH 🔥", color: "#FF6B35", desc: "Rất ấn tượng!" }
  if (avgMs < 500) return { label: "TỐT 👍", color: "#5B7BFF", desc: "Không tệ chút nào!" }
  return { label: "CÒN CẢI THIỆN 💪", color: "#B794F4", desc: "Luyện thêm nhé!" }
}

export default function FastFingerGame() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start")
  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<Round[]>([])
  const [phase, setPhase] = useState<"waiting" | "ready" | "tapped" | "early">("waiting")
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 })
  const [startTime, setStartTime] = useState(0)
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const clearTimer = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null } }

  const startRound = useCallback(() => {
    setPhase("waiting")
    setLastReaction(null)
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)
    timerRef.current = setTimeout(() => {
      // Random position within safe bounds (10%–85%)
      setTargetPos({ x: 10 + Math.random() * 75, y: 10 + Math.random() * 75 })
      setPhase("ready")
      setStartTime(Date.now())
    }, delay)
  }, [])

  useEffect(() => {
    if (screen === "game" && roundIndex < ROUNDS) startRound()
    return () => clearTimer()
  }, [screen, roundIndex])

  const handleAreaClick = () => {
    if (screen !== "game") return
    if (phase === "waiting") {
      clearTimer()
      setPhase("early")
      const newRounds = [...rounds, { reactionMs: null, missed: true }]
      setRounds(newRounds)
      setTimeout(() => {
        if (roundIndex + 1 < ROUNDS) { setRoundIndex(p => p + 1) }
        else finishGame(newRounds)
      }, 900)
    }
  }

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (phase !== "ready") return
    const ms = Date.now() - startTime
    setLastReaction(ms)
    setPhase("tapped")
    const newRounds = [...rounds, { reactionMs: ms, missed: false }]
    setRounds(newRounds)
    setTimeout(() => {
      if (roundIndex + 1 < ROUNDS) setRoundIndex(p => p + 1)
      else finishGame(newRounds)
    }, 700)
  }

  const finishGame = (finalRounds: Round[]) => {
    clearTimer()
    setScreen("result")
  }

  const handleRestart = () => {
    clearTimer()
    setRounds([])
    setRoundIndex(0)
    setPhase("waiting")
    setLastReaction(null)
    setScreen("start")
  }

  const validRounds = rounds.filter(r => !r.missed && r.reactionMs !== null)
  const avgMs = validRounds.length > 0 ? Math.round(validRounds.reduce((s, r) => s + (r.reactionMs ?? 0), 0) / validRounds.length) : 999
  const rating = getRating(avgMs)

  return (
    <AnimatePresence mode="wait">

      {/* START */}
      {screen === "start" && (
        <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center px-5">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="mb-8 inline-block">
            <div className="w-36 h-36 mx-auto rounded-full flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 0 80px rgba(16,185,129,0.7), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
              <Target className="w-20 h-20 text-white" />
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight"
            style={{ background: "linear-gradient(135deg, #10B981, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            FAST FINGER
          </h1>
          <p className="text-xl text-white/70 font-semibold mb-2">Nhanh tay chạm</p>
          <p className="text-white/50 mb-10">Nhấn vào mục tiêu xuất hiện ngẫu nhiên nhanh nhất có thể!</p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Target, label: "Vòng", value: ROUNDS, color: "#10B981" },
              { icon: Timer, label: "Phản xạ", value: "ms", color: "#FFD700" },
              { icon: Trophy, label: "Xếp hạng", value: "4 cấp", color: "#B794F4" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 mb-8 text-left" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", backdropFilter: "blur(10px)" }}>
            <p className="text-[#10B981] font-bold text-sm mb-1">⚡ Hướng dẫn</p>
            <p className="text-white/60 text-sm">Đợi mục tiêu xuất hiện rồi nhấn ngay. Nhấn sớm sẽ bị tính là lỡ!</p>
          </div>

          <motion.button onClick={() => setScreen("game")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 0 40px rgba(16,185,129,0.5)" }}>
            <motion.div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)" }}
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="relative z-10 flex items-center gap-3 justify-center"><Zap className="w-6 h-6" />BẮT ĐẦU</span>
          </motion.button>
        </motion.div>
      )}

      {/* GAME */}
      {screen === "game" && (
        <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              {Array.from({ length: ROUNDS }).map((_, i) => {
                const r = rounds[i]
                return (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: !r ? "rgba(255,255,255,0.1)" : r.missed ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.6)", border: i === roundIndex && !r ? "2px solid #10B981" : "none" }}>
                    {r && !r.missed ? "✓" : r?.missed ? "✗" : ""}
                  </div>
                )
              })}
            </div>
            <span className="text-white/50 text-sm">{roundIndex + 1} / {ROUNDS}</span>
          </div>

          {/* Arena */}
          <div ref={areaRef} onClick={handleAreaClick}
            className="relative w-full rounded-3xl overflow-hidden select-none"
            style={{ height: 380, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", cursor: phase === "waiting" ? "default" : "crosshair" }}>

            {/* Status overlay */}
            <AnimatePresence>
              {phase === "waiting" && (
                <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.15)" }}>
                    <Timer className="w-8 h-8 text-white/40" />
                  </motion.div>
                  <p className="text-white/50 font-semibold">Đợi mục tiêu xuất hiện...</p>
                  <p className="text-white/30 text-sm mt-1">Đừng nhấn vội!</p>
                </motion.div>
              )}

              {phase === "early" && (
                <motion.div key="early" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{ background: "rgba(239,68,68,0.15)" }}>
                  <p className="text-5xl mb-3">⚡</p>
                  <p className="text-red-400 text-2xl font-black">Quá sớm!</p>
                  <p className="text-white/50 text-sm mt-1">-1 lượt</p>
                </motion.div>
              )}

              {phase === "tapped" && lastReaction !== null && (
                <motion.div key="tapped" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{ background: "rgba(16,185,129,0.1)" }}>
                  <p className="text-5xl mb-3">⚡</p>
                  <p className="text-[#10B981] text-3xl font-black">{lastReaction} ms</p>
                  <p className="text-white/50 text-sm mt-1">{lastReaction < 250 ? "Cực nhanh!" : lastReaction < 400 ? "Nhanh tốt!" : "Cần luyện thêm!"}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Target button */}
            <AnimatePresence>
              {phase === "ready" && (
                <motion.button
                  key="target"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  onClick={handleTargetClick}
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    left: `${targetPos.x}%`, top: `${targetPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: 72, height: 72,
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    boxShadow: "0 0 30px rgba(16,185,129,0.8), 0 0 60px rgba(16,185,129,0.4)",
                    zIndex: 10,
                  }}>
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                    <Target className="w-9 h-9 text-white" />
                  </motion.div>
                  {/* Ripple */}
                  <motion.div className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(16,185,129,0.6)" }}
                    animate={{ scale: [1, 1.6, 2], opacity: [0.8, 0.3, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* RESULT */}
      {screen === "result" && (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center px-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }} className="mb-6">
            <div className="w-36 h-36 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${rating.color}, ${rating.color}88)`, boxShadow: `0 0 60px ${rating.color}80` }}>
              <Zap style={{ width: 72, height: 72 }} className="text-white" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-1">{rating.label}</h1>
          <p className="text-white/50 mb-8">{rating.desc}</p>

          <div className="rounded-3xl p-8 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Trung bình</p>
                <p className="text-4xl font-black" style={{ color: rating.color }}>{validRounds.length > 0 ? avgMs : "—"}</p>
                <p className="text-white/40 text-xs">ms</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Tốt nhất</p>
                <p className="text-4xl font-black text-[#10B981]">
                  {validRounds.length > 0 ? Math.min(...validRounds.map(r => r.reactionMs ?? 999)) : "—"}
                </p>
                <p className="text-white/40 text-xs">ms</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Chính xác</p>
                <p className="text-4xl font-black text-[#5B7BFF]">{validRounds.length}/{ROUNDS}</p>
                <p className="text-white/40 text-xs">lần</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {rounds.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                style={{ background: r.missed ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.08)", border: `1px solid ${r.missed ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                <span className="text-white/50 text-sm">Vòng {i + 1}</span>
                {r.missed ? <span className="text-red-400 text-sm font-semibold">Lỡ ✗</span> : <span className="font-bold text-[#10B981]">{r.reactionMs} ms ✓</span>}
              </motion.div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
            className="flex items-center gap-2 mx-auto px-10 py-4 rounded-full text-white font-bold"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}>
            <RefreshCw className="w-5 h-5" />Chơi lại
          </motion.button>
        </motion.div>
      )}

    </AnimatePresence>
  )
}
