"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Clock, Trophy, Star, Zap, CheckCircle2, XCircle, Gift } from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface GameState {
  screen: "start" | "question" | "loading" | "result"
  currentQuestionIndex: number
  answers: (number | null)[]
  score: number
  timeLeft: number
}

const QUESTIONS: Question[] = [
  // FPT
  { id: "1", text: "FPT Corporation được thành lập vào năm nào?", options: ["1985", "1988", "1991", "1995"], correctAnswer: 1, timeLimit: 15 },
  // Vinamilk
  { id: "2", text: "Vinamilk hiện là doanh nghiệp sữa lớn thứ bao nhiêu tại Đông Nam Á?", options: ["Thứ nhất", "Thứ hai", "Thứ ba", "Thứ tư"], correctAnswer: 0, timeLimit: 15 },
  // Vietcombank
  { id: "3", text: "Tên đầy đủ của Vietcombank là gì?", options: ["Ngân hàng Ngoại thương Việt Nam", "Ngân hàng Đầu tư Việt Nam", "Ngân hàng Công thương Việt Nam", "Ngân hàng Phát triển Việt Nam"], correctAnswer: 0, timeLimit: 15 },
  // VinGroup
  { id: "4", text: "Vingroup được thành lập bởi ai?", options: ["Trần Đình Long", "Phạm Nhật Vượng", "Nguyễn Thị Phương Thảo", "Đỗ Mười"], correctAnswer: 1, timeLimit: 15 },
  // Bonus
  { id: "5", text: "FPT Software có trụ sở chính tại thành phố nào của Việt Nam?", options: ["TP. Hồ Chí Minh", "Đà Nẵng", "Hà Nội", "Cần Thơ"], correctAnswer: 2, timeLimit: 15 },
]

// Use inline styles — Tailwind cannot compile arbitrary hex+opacity combos like from-[#hex]/20
const OPTION_SCHEMES = [
  { letter: "A", accent: "#E53E3E", bg: "rgba(229,62,62,0.18)", border: "rgba(252,129,129,0.35)", hoverBg: "rgba(229,62,62,0.32)", hoverBorder: "rgba(252,129,129,0.8)" },
  { letter: "B", accent: "#3182CE", bg: "rgba(49,130,206,0.18)", border: "rgba(99,179,237,0.35)", hoverBg: "rgba(49,130,206,0.32)", hoverBorder: "rgba(99,179,237,0.8)" },
  { letter: "C", accent: "#D69E2E", bg: "rgba(214,158,46,0.18)", border: "rgba(246,224,94,0.35)", hoverBg: "rgba(214,158,46,0.32)", hoverBorder: "rgba(246,224,94,0.8)" },
  { letter: "D", accent: "#6B46C1", bg: "rgba(107,70,193,0.18)", border: "rgba(183,148,244,0.35)", hoverBg: "rgba(107,70,193,0.32)", hoverBorder: "rgba(183,148,244,0.8)" },
]

// ─── Circular Timer ────────────────────────────────────────────────────────────
function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const percentage = (timeLeft / totalTime) * 100
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const color = percentage > 60 ? '#5B7BFF' : percentage > 30 ? '#FFD700' : '#EF4444'
  const isUrgent = timeLeft <= 5

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" className="absolute inset-0 -rotate-90" style={{ overflow: 'visible' }}>
        <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <circle cx="48" cy="48" r={radius} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease', filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 ${isUrgent ? '12px' : '8px'} ${color})` }} />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <motion.span className="text-2xl font-black tabular-nums leading-none" style={{ color }}
          animate={isUrgent ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.4, repeat: isUrgent ? Infinity : 0 }}>
          {timeLeft}
        </motion.span>
        <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">giây</span>
      </div>
    </div>
  )
}

// ─── Option Button ─────────────────────────────────────────────────────────────
function OptionButton({
  option, idx, isSelected, isCorrect, showResult, onClick,
}: {
  option: string; idx: number; isSelected: boolean; isCorrect: boolean
  showResult: boolean; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const scheme = OPTION_SCHEMES[idx]

  // Determine bg / border / text based on state
  let bg = hovered && !showResult ? scheme.hoverBg : scheme.bg
  let border = hovered && !showResult ? scheme.hoverBorder : scheme.border
  let textColor = "rgba(255,255,255,0.9)"
  let accentBg = scheme.accent

  if (showResult) {
    if (isCorrect) {
      bg = "rgba(34,197,94,0.22)"; border = "rgba(74,222,128,0.8)"; textColor = "#86efac"; accentBg = "#22c55e"
    } else if (isSelected) {
      bg = "rgba(239,68,68,0.22)"; border = "rgba(248,113,113,0.8)"; textColor = "#fca5a5"; accentBg = "#ef4444"
    } else {
      bg = "rgba(255,255,255,0.03)"; border = "rgba(255,255,255,0.08)"; textColor = "rgba(255,255,255,0.25)"
      accentBg = "rgba(255,255,255,0.15)"
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + idx * 0.07 }}
      whileHover={!showResult ? { y: -2 } : {}}
      whileTap={!showResult ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={showResult}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-4 p-4 rounded-2xl text-left w-full transition-all duration-200"
      style={{ background: bg, border: `1.5px solid ${border}`, backdropFilter: "blur(12px)" }}
    >
      {/* Letter badge */}
      <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white transition-all duration-200"
        style={{ background: accentBg, boxShadow: showResult && isCorrect ? "0 0 12px rgba(34,197,94,0.6)" : `0 0 8px ${scheme.accent}50` }}>
        {scheme.letter}
      </span>

      {/* Option text */}
      <span className="flex-1 text-base md:text-lg font-semibold transition-colors duration-200" style={{ color: textColor }}>
        {option}
      </span>

      {/* Result icon */}
      {showResult && (isSelected || isCorrect) && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.4 }}>
          {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
        </motion.div>
      )}

      {/* Active left bar */}
      {!showResult && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-opacity duration-200"
          style={{ background: scheme.accent, opacity: hovered ? 1 : 0 }} />
      )}
    </motion.button>
  )
}

// ─── Score Badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = (score / total) * 100
  const badge = pct >= 90 ? { name: "TOP PLAYER 🏆", color: "#FFD700", glow: "rgba(255,215,0,0.6)", icon: Trophy }
    : pct >= 70 ? { name: "GOLD ⭐", color: "#FFD700", glow: "rgba(255,215,0,0.5)", icon: Star }
    : pct >= 50 ? { name: "SILVER", color: "#C0C0C0", glow: "rgba(192,192,192,0.5)", icon: Star }
    : { name: "BRONZE", color: "#CD7F32", glow: "rgba(205,127,50,0.5)", icon: Star }
  const Icon = badge.icon
  return (
    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1 }} className="inline-block">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        className="w-36 h-36 rounded-full flex items-center justify-center mx-auto"
        style={{ background: `linear-gradient(135deg, ${badge.color}, ${badge.color}99)`, boxShadow: `0 0 50px ${badge.glow}` }}>
        <Icon style={{ width: 72, height: 72 }} className="text-white" />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="text-xl font-black mt-4 tracking-widest" style={{ color: badge.color }}>{badge.name}</motion.p>
    </motion.div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function QuizGame() {
  const total = QUESTIONS.length
  const [gameState, setGameState] = useState<GameState>({ screen: "start", currentQuestionIndex: 0, answers: Array(total).fill(null), score: 0, timeLeft: QUESTIONS[0].timeLimit })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const currentQuestion = QUESTIONS[gameState.currentQuestionIndex]
  const progress = ((gameState.currentQuestionIndex + 1) / total) * 100
  const selectedRef = useRef(selectedOption)
  selectedRef.current = selectedOption

  useEffect(() => {
    if (gameState.screen !== "question") return
    if (gameState.timeLeft <= 0) { handleNextQuestion(); return }
    const t = setInterval(() => setGameState(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000)
    return () => clearInterval(t)
  }, [gameState.screen, gameState.timeLeft])

  const handleStart = () => setGameState(p => ({ ...p, screen: "question", timeLeft: QUESTIONS[0].timeLimit }))

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    const newAnswers = [...gameState.answers]
    newAnswers[gameState.currentQuestionIndex] = idx
    setGameState(p => ({ ...p, answers: newAnswers }))
    setTimeout(() => handleNextQuestion(idx), 1400)
  }

  const handleNextQuestion = (forcedSelected?: number) => {
    const sel = forcedSelected ?? selectedRef.current
    const isCorrect = sel === currentQuestion.correctAnswer
    const newScore = gameState.score + (isCorrect ? 1 : 0)
    if (gameState.currentQuestionIndex < total - 1) {
      setGameState(p => ({ ...p, currentQuestionIndex: p.currentQuestionIndex + 1, score: newScore, timeLeft: QUESTIONS[p.currentQuestionIndex + 1].timeLimit }))
      setSelectedOption(null)
    } else {
      setGameState(p => ({ ...p, screen: "loading", score: newScore }))
      setSelectedOption(null)
      setTimeout(() => { setGameState(p => ({ ...p, screen: "result" })); setShowConfetti(true) }, 2000)
    }
  }

  const handleRestart = () => {
    setGameState({ screen: "start", currentQuestionIndex: 0, answers: Array(total).fill(null), score: 0, timeLeft: QUESTIONS[0].timeLimit })
    setSelectedOption(null)
    setShowConfetti(false)
  }

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={5000} />
      <AnimatePresence mode="wait">

        {/* ═══ START ═══ */}
        {gameState.screen === "start" && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center px-4">
            <motion.div animate={{ rotate: [0, 8, -8, 0], y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="mb-8 inline-block">
              <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #5B7BFF, #9B59B6)", boxShadow: "0 0 80px rgba(91,123,255,0.7), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                <Zap className="w-16 h-16 text-white" />
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
              </div>
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-black mb-3 tracking-tight"
              style={{ background: "linear-gradient(135deg, #5B7BFF, #B794F4, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>QUIZ</h1>
            <p className="text-2xl text-white/80 font-semibold mb-2">Mini Game</p>
            <p className="text-white/50 mb-10">Trả lời nhanh & chính xác để nhận quà!</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {[{ icon: Sparkles, label: "Câu hỏi", value: total, color: "#FFD700" }, { icon: Clock, label: "Giây/câu", value: "15s", color: "#5B7BFF" }].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-3xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <motion.button onClick={handleStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
              style={{ background: "linear-gradient(135deg, #5B7BFF, #9B59B6)", boxShadow: "0 0 40px rgba(91,123,255,0.5)" }}>
              <motion.div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)" }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="relative z-10 flex items-center gap-3 justify-center"><Zap className="w-6 h-6" />BẮT ĐẦU NGAY</span>
            </motion.button>
          </motion.div>
        )}

        {/* ═══ QUESTION ═══ */}
        {gameState.screen === "question" && currentQuestion && (
          <motion.div key={`q-${gameState.currentQuestionIndex}`}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl px-4">

            {/* Top bar: progress + timer */}
            <div className="flex items-center gap-5 mb-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                    Câu {gameState.currentQuestionIndex + 1} / {total}
                  </span>
                  <span className="text-white/30 text-xs">{Math.round(progress)}%</span>
                </div>
                {/* Step dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: total }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
                      style={{ background: i < gameState.currentQuestionIndex ? "#5B7BFF" : i === gameState.currentQuestionIndex ? "linear-gradient(90deg,#5B7BFF,#B794F4)" : "rgba(255,255,255,0.1)", boxShadow: i === gameState.currentQuestionIndex ? "0 0 8px rgba(91,123,255,0.8)" : "none" }} />
                  ))}
                </div>
              </div>
              <CircularTimer timeLeft={gameState.timeLeft} totalTime={currentQuestion.timeLimit} />
            </div>

            {/* Question card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="relative mb-5 rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(91,123,255,0.14) 0%, rgba(155,89,182,0.09) 100%)",
                border: "1px solid rgba(91,123,255,0.3)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 50px rgba(91,123,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}>
              {/* Top shine line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(91,123,255,0.6), rgba(183,148,244,0.4), transparent)" }} />

              {/* Q badge */}
              <div className="absolute top-4 left-5">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ background: "rgba(91,123,255,0.2)", color: "#B794F4", border: "1px solid rgba(183,148,244,0.3)" }}>
                  Q{gameState.currentQuestionIndex + 1}
                </span>
              </div>

              <div className="px-8 pt-14 pb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>
            </motion.div>

            {/* Options 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <OptionButton
                  key={idx}
                  option={option}
                  idx={idx}
                  isSelected={selectedOption === idx}
                  isCorrect={idx === currentQuestion.correctAnswer}
                  showResult={selectedOption !== null}
                  onClick={() => handleSelectOption(idx)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ LOADING ═══ */}
        {gameState.screen === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div className="absolute inset-0 rounded-full"
                style={{ background: "conic-gradient(from 0deg, #5B7BFF, #B794F4, #FFD700, #5B7BFF)", filter: "blur(2px)" }}
                animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
              <div className="absolute inset-2 rounded-full" style={{ background: "#070B1A" }} />
              <Zap className="absolute inset-0 m-auto w-12 h-12 text-[#5B7BFF]" />
            </div>
            <motion.h2 animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl font-black text-white mb-2">Đang tính điểm...</motion.h2>
            <p className="text-white/40">Chờ xíu nhé!</p>
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {gameState.screen === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center px-4">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white mb-2">Chúc mừng! 🎉</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-white/50 mb-10">Bạn đã hoàn thành thử thách!</motion.p>
            <div className="mb-12"><ScoreBadge score={gameState.score} total={total} /></div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="rounded-3xl p-8 mb-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <p className="text-white/50 text-sm uppercase tracking-widest mb-3">Điểm số</p>
              <div className="text-7xl md:text-8xl font-black mb-3"
                style={{ background: "linear-gradient(135deg, #5B7BFF, #B794F4, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {gameState.score}<span className="text-4xl text-white/30">/{total}</span>
              </div>
              <p className="text-lg text-white/70">Trả lời đúng <span className="font-bold" style={{ color: "#FFD700" }}>{gameState.score}</span> / {total} câu</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative px-10 py-4 rounded-full text-black text-lg font-black overflow-hidden"
                style={{ background: "linear-gradient(135deg, #FFD700, #FDB931)", boxShadow: "0 0 40px rgba(255,215,0,0.4)" }}>
                <motion.div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="relative z-10 flex items-center gap-2 justify-center"><Gift className="w-5 h-5" />NHẬN QUÀ NGAY</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
                className="px-10 py-4 rounded-full text-white text-lg font-semibold"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                Chơi lại
              </motion.button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}
