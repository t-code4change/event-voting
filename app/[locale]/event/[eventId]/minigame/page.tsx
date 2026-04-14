"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import {
  Sparkles, Clock, Trophy, Star, Zap,
  CheckCircle2, XCircle, Gift, Loader2
} from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

// Types
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

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "Sự kiện Bright4Event được tổ chức lần đầu vào năm nào?",
    options: ["2020", "2021", "2022", "2023"],
    correctAnswer: 1,
    timeLimit: 15,
  },
  {
    id: "2",
    text: "Đâu là slogan của sự kiện năm nay?",
    options: ["Glow Up 2025", "Shine Bright", "Light the Future", "Spark Joy"],
    correctAnswer: 0,
    timeLimit: 15,
  },
  {
    id: "3",
    text: "Bao nhiêu hạng mục bình chọn trong sự kiện?",
    options: ["2 hạng mục", "3 hạng mục", "4 hạng mục", "5 hạng mục"],
    correctAnswer: 2,
    timeLimit: 15,
  },
  {
    id: "4",
    text: "Thời gian bình chọn kết thúc vào lúc nào?",
    options: ["19:00", "20:00", "21:00", "22:00"],
    correctAnswer: 2,
    timeLimit: 15,
  },
  {
    id: "5",
    text: "Giải thưởng lớn nhất của sự kiện là gì?",
    options: ["Chuyến du lịch", "Tiền mặt", "Thiết bị điện tử", "Voucher mua sắm"],
    correctAnswer: 0,
    timeLimit: 15,
  },
]

// Option color schemes A/B/C/D
const OPTION_COLORS = [
  {
    idle: "from-[#E53E3E]/20 to-[#C53030]/10 border-[#FC8181]/30 hover:border-[#FC8181]/70",
    letter: "bg-[#E53E3E] text-white",
    selected: "from-[#E53E3E]/40 to-[#C53030]/30 border-[#FC8181]",
    correct: "from-green-500/30 to-green-600/20 border-green-400",
    wrong: "from-red-500/30 to-red-600/20 border-red-400",
  },
  {
    idle: "from-[#3182CE]/20 to-[#2B6CB0]/10 border-[#63B3ED]/30 hover:border-[#63B3ED]/70",
    letter: "bg-[#3182CE] text-white",
    selected: "from-[#3182CE]/40 to-[#2B6CB0]/30 border-[#63B3ED]",
    correct: "from-green-500/30 to-green-600/20 border-green-400",
    wrong: "from-red-500/30 to-red-600/20 border-red-400",
  },
  {
    idle: "from-[#D69E2E]/20 to-[#B7791F]/10 border-[#F6E05E]/30 hover:border-[#F6E05E]/70",
    letter: "bg-[#D69E2E] text-white",
    selected: "from-[#D69E2E]/40 to-[#B7791F]/30 border-[#F6E05E]",
    correct: "from-green-500/30 to-green-600/20 border-green-400",
    wrong: "from-red-500/30 to-red-600/20 border-red-400",
  },
  {
    idle: "from-[#6B46C1]/20 to-[#553C9A]/10 border-[#B794F4]/30 hover:border-[#B794F4]/70",
    letter: "bg-[#6B46C1] text-white",
    selected: "from-[#6B46C1]/40 to-[#553C9A]/30 border-[#B794F4]",
    correct: "from-green-500/30 to-green-600/20 border-green-400",
    wrong: "from-red-500/30 to-red-600/20 border-red-400",
  },
]

// Particle Background
function ParticleBackground() {
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 })
  useEffect(() => { setDimensions({ w: window.innerWidth, h: window.innerHeight }) }, [])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 4 === 0 ? '#5B7BFF' : i % 4 === 1 ? '#B794F4' : i % 4 === 2 ? '#FFD700' : '#63B3ED',
          }}
          initial={{ x: Math.random() * dimensions.w, y: Math.random() * dimensions.h, opacity: 0 }}
          animate={{
            x: Math.random() * dimensions.w,
            y: Math.random() * dimensions.h,
            opacity: [0, 0.6, 0],
          }}
          transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
        />
      ))}
    </div>
  )
}

// Premium Circular Timer
function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const percentage = (timeLeft / totalTime) * 100
  const radius = 54
  const circumference = 2 * Math.PI * radius
  // Correct offset: 0 = full circle, circumference = empty
  const offset = circumference - (percentage / 100) * circumference

  const color = percentage > 60 ? '#5B7BFF' : percentage > 30 ? '#FFD700' : '#EF4444'
  const glowColor = percentage > 60 ? 'rgba(91,123,255,0.8)' : percentage > 30 ? 'rgba(255,215,0,0.8)' : 'rgba(239,68,68,0.8)'
  const isUrgent = timeLeft <= 5

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      {/* Outer ring glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: isUrgent ? [`0 0 30px ${glowColor}`, `0 0 60px ${glowColor}`, `0 0 30px ${glowColor}`] : `0 0 20px ${glowColor}` }}
        transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
      />

      <svg width="140" height="140" className="transform -rotate-90 absolute inset-0">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        {/* Progress — no framer-motion animate so it doesn't reset each tick */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease',
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          className="text-4xl font-black tabular-nums leading-none"
          style={{ color }}
          animate={isUrgent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, repeat: isUrgent ? Infinity : 0 }}
        >
          {timeLeft}
        </motion.span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">giây</span>
      </div>
    </div>
  )
}

// Badge for result screen
function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = (score / total) * 100
  const badge = pct >= 90
    ? { name: "TOP PLAYER 🏆", color: "#FFD700", glow: "rgba(255,215,0,0.6)", icon: Trophy }
    : pct >= 70
    ? { name: "GOLD ⭐", color: "#FFD700", glow: "rgba(255,215,0,0.5)", icon: Star }
    : pct >= 50
    ? { name: "SILVER", color: "#C0C0C0", glow: "rgba(192,192,192,0.5)", icon: Star }
    : { name: "BRONZE", color: "#CD7F32", glow: "rgba(205,127,50,0.5)", icon: Star }

  const Icon = badge.icon
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 1 }}
      className="relative inline-block"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        className="w-36 h-36 rounded-full flex items-center justify-center mx-auto"
        style={{ background: `linear-gradient(135deg, ${badge.color}, ${badge.color}99)`, boxShadow: `0 0 50px ${badge.glow}` }}
      >
        <Icon className="w-18 h-18 text-white" style={{ width: 72, height: 72 }} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-black mt-4 tracking-widest"
        style={{ color: badge.color }}
      >
        {badge.name}
      </motion.p>
    </motion.div>
  )
}

// Main
export default function MiniGamePage() {
  const totalQuestions = MOCK_QUESTIONS.length

  const [gameState, setGameState] = useState<GameState>({
    screen: "start",
    currentQuestionIndex: 0,
    answers: Array(totalQuestions).fill(null),
    score: 0,
    timeLeft: MOCK_QUESTIONS[0]?.timeLimit || 15,
  })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentQuestion = MOCK_QUESTIONS[gameState.currentQuestionIndex]
  const progress = ((gameState.currentQuestionIndex + 1) / totalQuestions) * 100

  // Use a ref to avoid stale closure in handleNextQuestion
  const selectedRef = useRef(selectedOption)
  selectedRef.current = selectedOption

  useEffect(() => {
    if (gameState.screen !== "question") return
    if (gameState.timeLeft <= 0) { handleNextQuestion(); return }
    const t = setInterval(() => {
      setGameState(p => ({ ...p, timeLeft: p.timeLeft - 1 }))
    }, 1000)
    return () => clearInterval(t)
  }, [gameState.screen, gameState.timeLeft])

  const handleStart = () => {
    setGameState(p => ({ ...p, screen: "question", timeLeft: MOCK_QUESTIONS[0].timeLimit }))
  }

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    const newAnswers = [...gameState.answers]
    newAnswers[gameState.currentQuestionIndex] = idx
    setGameState(p => ({ ...p, answers: newAnswers }))
    setTimeout(() => handleNextQuestion(idx), 1200)
  }

  const handleNextQuestion = (forcedSelected?: number) => {
    const sel = forcedSelected ?? selectedRef.current
    const isCorrect = sel === currentQuestion.correctAnswer
    const newScore = gameState.score + (isCorrect ? 1 : 0)

    if (gameState.currentQuestionIndex < totalQuestions - 1) {
      setGameState(p => ({
        ...p,
        currentQuestionIndex: p.currentQuestionIndex + 1,
        score: newScore,
        timeLeft: MOCK_QUESTIONS[p.currentQuestionIndex + 1].timeLimit,
      }))
      setSelectedOption(null)
    } else {
      setGameState(p => ({ ...p, screen: "loading", score: newScore }))
      setSelectedOption(null)
      setTimeout(() => {
        setGameState(p => ({ ...p, screen: "result" }))
        setShowConfetti(true)
      }, 2000)
    }
  }

  const handleRestart = () => {
    setGameState({ screen: "start", currentQuestionIndex: 0, answers: Array(totalQuestions).fill(null), score: 0, timeLeft: MOCK_QUESTIONS[0]?.timeLimit || 15 })
    setSelectedOption(null)
    setShowConfetti(false)
  }

  return (
    <div className="min-h-screen bg-[#070B1A] relative overflow-hidden">
      <ParticleBackground />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-[-10%] left-1/4 w-[700px] h-[700px] bg-[#5B7BFF]/15 rounded-full blur-[140px]"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[120px]"
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        <motion.div className="absolute top-1/2 left-[-5%] w-[400px] h-[400px] bg-[#FFD700]/8 rounded-full blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }} />
      </div>

      <ConfettiEffect show={showConfetti} duration={5000} />

      {/* Company Logo — fixed top-left, visible on all screens */}
      <div className="fixed top-5 left-5 z-50">
        <div className="flex items-center justify-center w-20 h-12 rounded-xl"
          style={{ border: "2px solid rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}>
          <span className="text-white text-xs font-bold tracking-widest uppercase">LOGO</span>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">

          {/* ═══ START SCREEN ═══ */}
          {gameState.screen === "start" && (
            <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg w-full text-center">

              <motion.div animate={{ rotate: [0, 8, -8, 0], y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="mb-8 inline-block">
                <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center relative"
                  style={{ background: "linear-gradient(135deg, #5B7BFF, #9B59B6)", boxShadow: "0 0 80px rgba(91,123,255,0.7), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  <Zap className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-black mb-3 tracking-tight"
                style={{ background: "linear-gradient(135deg, #5B7BFF, #B794F4, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                QUIZ
              </h1>
              <p className="text-2xl text-white/80 font-semibold mb-2">Mini Game</p>
              <p className="text-white/50 mb-10">Trả lời nhanh & chính xác để nhận quà!</p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Sparkles, label: "Câu hỏi", value: totalQuestions, color: "#FFD700" },
                  { icon: Clock, label: "Giây/câu", value: "15s", color: "#5B7BFF" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-2xl p-5 text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-black text-white">{value}</p>
                  </div>
                ))}
              </div>

              <motion.button onClick={handleStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
                style={{ background: "linear-gradient(135deg, #5B7BFF, #9B59B6)", boxShadow: "0 0 40px rgba(91,123,255,0.5)" }}>
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  <Zap className="w-6 h-6" />
                  BẮT ĐẦU NGAY
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* ═══ QUESTION SCREEN ═══ */}
          {gameState.screen === "question" && currentQuestion && (
            <motion.div key={`q-${gameState.currentQuestionIndex}`}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl">

              {/* Header row: progress + timer */}
              <div className="flex items-center gap-6 mb-8">
                {/* Progress */}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-widest mb-2">
                    <span>Câu {gameState.currentQuestionIndex + 1} / {totalQuestions}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #5B7BFF, #B794F4)", boxShadow: "0 0 12px rgba(91,123,255,0.8)" }}
                      animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
                  </div>
                </div>

                {/* Circular Timer */}
                <CircularTimer timeLeft={gameState.timeLeft} totalTime={currentQuestion.timeLimit} />
              </div>

              {/* Question card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="relative mb-6 rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(91,123,255,0.12), rgba(155,89,182,0.08))",
                  border: "1px solid rgba(91,123,255,0.25)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 60px rgba(91,123,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(91,123,255,0.5), transparent)" }} />

                {/* Question number badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "rgba(91,123,255,0.25)", color: "#B794F4", border: "1px solid rgba(183,148,244,0.3)" }}>
                    Q{gameState.currentQuestionIndex + 1}
                  </span>
                </div>

                <div className="px-8 pt-12 pb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed">
                    {currentQuestion.text}
                  </h2>
                </div>
              </motion.div>

              {/* Options grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx
                  const isCorrect = idx === currentQuestion.correctAnswer
                  const showResult = selectedOption !== null
                  const scheme = OPTION_COLORS[idx]

                  let gradientClass = scheme.idle
                  if (showResult) {
                    if (isCorrect) gradientClass = scheme.correct
                    else if (isSelected) gradientClass = scheme.wrong
                    else gradientClass = "from-white/3 to-white/1 border-white/10"
                  }

                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.07 }}
                      whileHover={!showResult ? { y: -3, scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.97 } : {}}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showResult}
                      className={`relative flex items-center gap-4 p-5 rounded-2xl text-left border-2 bg-gradient-to-r transition-all duration-300 group ${gradientClass}`}
                      style={{ backdropFilter: "blur(10px)" }}
                    >
                      {/* Letter badge */}
                      <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 ${
                        showResult && isCorrect ? "bg-green-500 text-white" :
                        showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                        scheme.letter
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>

                      <span className={`flex-1 text-base md:text-lg font-semibold transition-colors duration-300 ${
                        showResult && !isCorrect && !isSelected ? "text-white/35" :
                        showResult && isCorrect ? "text-green-300" :
                        showResult && isSelected ? "text-red-300" : "text-white"
                      }`}>
                        {option}
                      </span>

                      {/* Result icon */}
                      {showResult && (isSelected || isCorrect) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.4 }}>
                          {isCorrect
                            ? <CheckCircle2 className="w-6 h-6 text-green-400" />
                            : <XCircle className="w-6 h-6 text-red-400" />
                          }
                        </motion.div>
                      )}

                      {/* Hover shimmer */}
                      {!showResult && (
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ LOADING SCREEN ═══ */}
          {gameState.screen === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="text-center">
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

          {/* ═══ RESULT SCREEN ═══ */}
          {gameState.screen === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg w-full text-center">

              <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-white mb-2">
                Chúc mừng! 🎉
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="text-white/50 mb-10">Bạn đã hoàn thành thử thách!</motion.p>

              <div className="mb-12">
                <ScoreBadge score={gameState.score} total={totalQuestions} />
              </div>

              {/* Score card */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className="rounded-3xl p-8 mb-8"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                <p className="text-white/50 text-sm uppercase tracking-widest mb-3">Điểm số</p>
                <div className="text-7xl md:text-8xl font-black mb-3"
                  style={{ background: "linear-gradient(135deg, #5B7BFF, #B794F4, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {gameState.score}<span className="text-4xl text-white/30">/{totalQuestions}</span>
                </div>
                <p className="text-lg text-white/70">
                  Trả lời đúng <span className="text-[#FFD700] font-bold">{gameState.score}</span> / {totalQuestions} câu
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="relative px-10 py-4 rounded-full text-black text-lg font-black overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FDB931)", boxShadow: "0 0 40px rgba(255,215,0,0.4)" }}>
                  <motion.div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Gift className="w-5 h-5" /> NHẬN QUÀ NGAY
                  </span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
                  className="px-10 py-4 rounded-full text-white text-lg font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  Chơi lại
                </motion.button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
