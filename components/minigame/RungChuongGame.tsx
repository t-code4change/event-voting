"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCircle2, XCircle, Trophy, Star, RefreshCw, Zap } from "lucide-react"
import ConfettiEffect from "@/components/ConfettiEffect"

interface Question {
  text: string
  options: string[]
  correctAnswer: number
}

const QUESTIONS: Question[] = [
  { text: "Màu sắc đặc trưng của sự kiện năm nay là gì?", options: ["Đỏ & Vàng", "Xanh & Trắng", "Tím & Vàng", "Cam & Đen"], correctAnswer: 2 },
  { text: "CEO của công ty đứng ra tổ chức là ai?", options: ["Nguyễn Minh Tú", "Trần Văn Hải", "Lê Hoàng Nam", "Phạm Quốc Bảo"], correctAnswer: 0 },
  { text: "Sự kiện diễn ra tại đâu?", options: ["Rex Hotel", "Caravelle Hotel", "Grand Palace", "New World Hotel"], correctAnswer: 2 },
  { text: "Chủ đề của đêm gala là gì?", options: ["Vươn Tầm Cao Mới", "Kết Nối Tương Lai", "Ánh Sáng Rực Rỡ", "Hành Trình Mới"], correctAnswer: 2 },
  { text: "Bao nhiêu năm công ty đã hoạt động?", options: ["5 năm", "8 năm", "10 năm", "12 năm"], correctAnswer: 2 },
]

const BELL_TIME = 8 // seconds to press bell
const ANSWER_TIME = 10 // seconds to answer

const OPTION_COLORS = [
  { bg: "from-[#E53E3E]/20 to-[#C53030]/10 border-[#FC8181]/40", letter: "bg-[#E53E3E]" },
  { bg: "from-[#3182CE]/20 to-[#2B6CB0]/10 border-[#63B3ED]/40", letter: "bg-[#3182CE]" },
  { bg: "from-[#D69E2E]/20 to-[#B7791F]/10 border-[#F6E05E]/40", letter: "bg-[#D69E2E]" },
  { bg: "from-[#6B46C1]/20 to-[#553C9A]/10 border-[#B794F4]/40", letter: "bg-[#6B46C1]" },
]

export default function RungChuongGame() {
  const [screen, setScreen] = useState<"start" | "bell" | "answer" | "reveal" | "result">("start")
  const [qIndex, setQIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(BELL_TIME)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<{ correct: boolean; time: number }[]>([])
  const [bellTime, setBellTime] = useState(0)
  const [bellPressedAt, setBellPressedAt] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQ = QUESTIONS[qIndex]

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  // Bell countdown
  useEffect(() => {
    if (screen !== "bell") return
    setTimeLeft(BELL_TIME)
    setBellTime(Date.now())
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearTimer()
          // Time out without pressing bell — mark as wrong
          const r = [...results, { correct: false, time: BELL_TIME * 1000 }]
          setResults(r)
          if (qIndex + 1 < QUESTIONS.length) { setQIndex(q => q + 1); setScreen("bell") }
          else { setScreen("result"); if (score > 0) setShowConfetti(true) }
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearTimer()
  }, [screen, qIndex])

  // Answer countdown
  useEffect(() => {
    if (screen !== "answer") return
    setTimeLeft(ANSWER_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearTimer(); handleReveal(selected); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearTimer()
  }, [screen])

  const handleBellPress = () => {
    if (screen !== "bell") return
    clearTimer()
    const elapsed = Date.now() - bellTime
    setBellPressedAt(elapsed)
    setScreen("answer")
    setSelected(null)
  }

  const handleSelectAnswer = (idx: number) => {
    if (selected !== null || screen !== "answer") return
    clearTimer()
    setSelected(idx)
    setTimeout(() => handleReveal(idx), 1000)
  }

  const handleReveal = (sel: number | null) => {
    const isCorrect = sel === currentQ.correctAnswer
    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) setScore(newScore)
    const r = [...results, { correct: isCorrect, time: bellPressedAt }]
    setResults(r)
    setScreen("reveal")
    setTimeout(() => {
      if (qIndex + 1 < QUESTIONS.length) { setQIndex(q => q + 1); setSelected(null); setScreen("bell") }
      else { setScreen("result"); if (newScore > 0) setShowConfetti(true) }
    }, 2000)
  }

  const handleRestart = () => {
    clearTimer()
    setScreen("start")
    setQIndex(0)
    setTimeLeft(BELL_TIME)
    setSelected(null)
    setScore(0)
    setResults([])
    setShowConfetti(false)
  }

  const pct = (score / QUESTIONS.length) * 100
  const badge = pct >= 80 ? { label: "QUÁN QUÂN 🏆", color: "#FFD700" }
    : pct >= 60 ? { label: "XUẤT SẮC ⭐", color: "#5B7BFF" }
    : pct >= 40 ? { label: "KHÁ 👍", color: "#10B981" }
    : { label: "CỐ GẮNG HƠN 💪", color: "#B794F4" }

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={5000} />
      <AnimatePresence mode="wait">

        {/* START */}
        {screen === "start" && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center">
            <motion.div animate={{ rotate: [-15, 15, -15], y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="mb-8 inline-block">
              <div className="w-36 h-36 mx-auto rounded-full flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 80px rgba(245,158,11,0.7), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
                <Bell className="w-20 h-20 text-white" />
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              RUNG CHUÔNG
            </h1>
            <p className="text-xl text-white/70 font-semibold mb-2">Trả lời nhanh</p>
            <p className="text-white/50 mb-10">Rung chuông trước khi hết giờ, rồi chọn đáp án đúng!</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Bell, label: "Câu hỏi", value: QUESTIONS.length, color: "#F59E0B" },
                { icon: Zap, label: "Thời gian chuông", value: `${BELL_TIME}s`, color: "#EF4444" },
                { icon: Trophy, label: "Điểm tối đa", value: QUESTIONS.length, color: "#FFD700" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <motion.button onClick={() => setScreen("bell")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative px-14 py-5 rounded-full text-white text-xl font-black tracking-wide overflow-hidden"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}>
              <motion.div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)" }}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="relative z-10 flex items-center gap-3 justify-center"><Bell className="w-6 h-6" />BẮT ĐẦU</span>
            </motion.button>
          </motion.div>
        )}

        {/* BELL PHASE */}
        {screen === "bell" && (
          <motion.div key={`bell-${qIndex}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-2xl text-center">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ background: i < qIndex ? "#F59E0B" : i === qIndex ? "#FFFFFF" : "rgba(255,255,255,0.2)", boxShadow: i === qIndex ? "0 0 8px white" : "none" }} />
              ))}
            </div>

            {/* Question card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="relative mb-8 rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))", border: "1px solid rgba(245,158,11,0.3)", backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(245,158,11,0.1)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                  Câu {qIndex + 1}
                </span>
              </div>
              <div className="px-8 pt-12 pb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">{currentQ.text}</h2>
              </div>
            </motion.div>

            {/* Countdown */}
            <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Còn {timeLeft} giây</p>
            <div className="h-1.5 rounded-full mx-auto w-3/4 mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #EF4444)" }}
                animate={{ width: `${(timeLeft / BELL_TIME) * 100}%` }} transition={{ duration: 0.8, ease: "linear" }} />
            </div>

            {/* Big bell button */}
            <motion.button onClick={handleBellPress} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
              className="relative w-44 h-44 mx-auto rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 60px rgba(245,158,11,0.7), 0 0 100px rgba(245,158,11,0.3)" }}>
              <motion.div className="absolute inset-0 rounded-full" animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity }}>
                <div className="w-full h-full rounded-full" style={{ border: "3px solid rgba(245,158,11,0.5)" }} />
              </motion.div>
              <motion.div animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 0.4, repeat: Infinity }}>
                <Bell className="w-20 h-20 text-white" />
              </motion.div>
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)" }} />
            </motion.button>

            <p className="text-white/50 mt-6 font-semibold">Nhấn chuông để trả lời!</p>
          </motion.div>
        )}

        {/* ANSWER PHASE */}
        {screen === "answer" && (
          <motion.div key="answer" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}
              className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.4)" }}>
                <Bell className="w-4 h-4" />
                CHUÔNG! — Còn {timeLeft}s để trả lời
              </div>
            </motion.div>

            <div className="relative rounded-3xl overflow-hidden mb-6 p-6"
              style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))", border: "1px solid rgba(245,158,11,0.25)", backdropFilter: "blur(20px)" }}>
              <h2 className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">{currentQ.text}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const scheme = OPTION_COLORS[idx]
                return (
                  <motion.button key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                    whileHover={selected === null ? { y: -3, scale: 1.02 } : {}} whileTap={selected === null ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectAnswer(idx)} disabled={selected !== null}
                    className={`relative flex items-center gap-4 p-5 rounded-2xl text-left border-2 bg-gradient-to-r transition-all duration-300 ${scheme.bg}`}
                    style={{ backdropFilter: "blur(10px)" }}>
                    <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white ${scheme.letter}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-base font-semibold text-white">{option}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* REVEAL */}
        {screen === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center">
            {results[results.length - 1]?.correct ? (
              <>
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6 }} className="text-8xl mb-4">✅</motion.div>
                <h2 className="text-4xl font-black text-green-400 mb-2">Chính xác!</h2>
                <p className="text-white/50">+1 điểm</p>
              </>
            ) : (
              <>
                <motion.div animate={{ x: [-10, 10, -10, 10, 0] }} transition={{ duration: 0.4 }} className="text-8xl mb-4">❌</motion.div>
                <h2 className="text-4xl font-black text-red-400 mb-2">Sai rồi!</h2>
                <p className="text-white/50">Đáp án: {currentQ.options[currentQ.correctAnswer]}</p>
              </>
            )}
          </motion.div>
        )}

        {/* RESULT */}
        {screen === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-lg w-full text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1 }} className="mb-6">
              <div className="w-36 h-36 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${badge.color}, ${badge.color}88)`, boxShadow: `0 0 60px ${badge.color}80` }}>
                <Trophy style={{ width: 72, height: 72 }} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl font-black mb-1" style={{ color: badge.color }}>{badge.label}</h1>
            <p className="text-white/50 mb-8">Hoàn thành {QUESTIONS.length} câu hỏi</p>

            <div className="rounded-3xl p-8 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <p className="text-white/50 text-sm uppercase tracking-widest mb-3">Điểm số</p>
              <div className="text-7xl font-black mb-2" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {score}<span className="text-4xl text-white/30">/{QUESTIONS.length}</span>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              {results.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                  style={{ background: r.correct ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${r.correct ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                  <span className="text-white/60 text-sm">Câu {i + 1}</span>
                  {r.correct ? <span className="text-green-400 font-bold text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Đúng</span>
                    : <span className="text-red-400 font-bold text-sm flex items-center gap-1"><XCircle className="w-4 h-4" />Sai</span>}
                </motion.div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRestart}
              className="flex items-center gap-2 mx-auto px-10 py-4 rounded-full text-white font-bold"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}>
              <RefreshCw className="w-5 h-5" />Chơi lại
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}
